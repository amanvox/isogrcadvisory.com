// Lead capture for the static site. Only /api/* reaches this Worker (run_worker_first);
// everything else is served straight from static assets.
//
// POST /api/lead  → origin/size/shape checks, per-IP rate limits, Turnstile on the first post of a lead,
//                   upsert into D1, email an alert when the enquiry is complete.
// Cron (every 15 min) → alert for step-1-only enquiries that were never completed.
//
// Secrets (wrangler secret put): LEAD_NOTIFY_TO (verified Email Routing destination), TURNSTILE_SECRET,
// IP_HASH_SALT, optional SHEET_WEBHOOK (Google Apps Script /exec URL to mirror rows into a Sheet).

import { EmailMessage } from 'cloudflare:email';
import { buildAlert, mime, ROUTES } from './email';

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Database;
  LEAD_MAIL: { send: (msg: EmailMessage) => Promise<void> };
  LEAD_LIMITER: { limit: (o: { key: string }) => Promise<{ success: boolean }> };
  LEAD_NOTIFY_TO: string;
  TURNSTILE_SECRET: string;
  IP_HASH_SALT: string;
  SHEET_WEBHOOK?: string;
}
type D1Database = {
  prepare: (sql: string) => { bind: (...v: unknown[]) => { run: () => Promise<unknown>; first: <T>() => Promise<T | null>; all: <T>() => Promise<{ results: T[] }> } };
};
type Lead = Record<string, unknown> & { lead_id: string; stage: 'partial' | 'complete'; score?: { total?: number; tier?: string } };

const FROM = 'leads@isogrcadvisory.com';
const SITE_HOSTS = /^(www\.)?isogrcadvisory\.com$/;
const DEV_HOSTS = /^(localhost|127\.0\.0\.1)$/;
const MAX_BODY = 32_000;
const MAX_NEW_LEADS_PER_IP_PER_HOUR = 6;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex' },
  });
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v: string) => /^[^\s@<>,;"]{1,64}@[^\s@<>,;"]{1,190}\.[a-z]{2,24}$/i.test(v);
const isPhone = (v: string) => /^\+?[\d\s().-]{6,24}$/.test(v);

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

async function verifyTurnstile(env: Env, token: string, ip: string) {
  if (!token || token.length > 2048 || !env.TURNSTILE_SECRET) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const out = (await res.json()) as { success?: boolean; hostname?: string; action?: string };
  return !!out.success && out.action === 'lead' && (SITE_HOSTS.test(out.hostname || '') || DEV_HOSTS.test(out.hostname || ''));
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    if (url.pathname !== '/api/lead') return json({ ok: false, error: 'not_found' }, 404);
    if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });

    // Browsers always send Origin on a cross-context POST; require it and the site's own host.
    let originHost = '';
    try { originHost = new URL(req.headers.get('Origin') || '').hostname; } catch { /* missing or malformed */ }
    const devRequest = DEV_HOSTS.test(url.hostname);
    if (!(SITE_HOSTS.test(originHost) || (devRequest && DEV_HOSTS.test(originHost)))) return json({ ok: false, error: 'origin' }, 403);
    if (!(req.headers.get('Content-Type') || '').startsWith('application/json')) return json({ ok: false, error: 'content_type' }, 415);

    const ip = req.headers.get('CF-Connecting-IP') || '';
    const { success } = await env.LEAD_LIMITER.limit({ key: ip || 'unknown' });
    if (!success) return json({ ok: false, error: 'rate_limited' }, 429);

    const text = await req.text();
    if (text.length > MAX_BODY) return json({ ok: false, error: 'size' }, 413);
    let lead: Lead;
    try { lead = JSON.parse(text); } catch { return json({ ok: false, error: 'json' }, 400); }
    if (!lead || typeof lead !== 'object' || Array.isArray(lead) || Object.keys(lead).length > 80) return json({ ok: false, error: 'shape' }, 400);

    // Honeypot: pretend success so bots don't retry.
    if (str(lead.website)) return json({ ok: true });
    if (!/^L[A-Z0-9]{4,12}-[A-Z0-9]{1,8}$/.test(str(lead.lead_id, 40))) return json({ ok: false, error: 'id' }, 400);
    if (lead.stage !== 'partial' && lead.stage !== 'complete') return json({ ok: false, error: 'stage' }, 400);
    const email = str(lead.email, 254), phone = str(lead.phone, 40);
    if (!str(lead.name) || (!email && !phone) || !str(lead.consent_service)) return json({ ok: false, error: 'fields' }, 422);
    if ((email && !isEmail(email)) || (phone && !isPhone(phone))) return json({ ok: false, error: 'fields' }, 422);
    if (!ROUTES[str(lead.route, 40)]) return json({ ok: false, error: 'route' }, 422);

    const token = str(lead.cf_turnstile, 4096);
    // Never store challenge tokens (the widget also adds its own hidden form field).
    for (const k of Object.keys(lead)) if (k === 'cf_turnstile' || k.startsWith('cf-turnstile') || k.startsWith('g-recaptcha')) delete lead[k];
    const ipHash = ip ? await sha256(`${env.IP_HASH_SALT}|${ip}`) : '';

    // A new lead must pass Turnstile and the hourly per-IP cap; later posts for the same lead_id
    // (step 2, retries) are tied to that verified row.
    const existing = await env.DB.prepare('SELECT ip_hash FROM leads WHERE lead_id = ?1').bind(lead.lead_id).first<{ ip_hash: string | null }>();
    if (!existing) {
      if (!(await verifyTurnstile(env, token, ip))) return json({ ok: false, error: 'challenge' }, 403);
      if (ipHash) {
        const since = new Date(Date.now() - 3_600_000).toISOString();
        const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ?1 AND created_at > ?2').bind(ipHash, since).first<{ n: number }>();
        if ((recent?.n ?? 0) >= MAX_NEW_LEADS_PER_IP_PER_HOUR) return json({ ok: false, error: 'rate_limited' }, 429);
      }
    } else if (existing.ip_hash && ipHash && existing.ip_hash !== ipHash && !(await verifyTurnstile(env, token, ip))) {
      // Same lead from a different network (e.g. phone moved from Wi-Fi to mobile data) needs a fresh challenge.
      return json({ ok: false, error: 'challenge' }, 403);
    }

    const now = new Date().toISOString();
    const ft = (lead.first_touch || {}) as Record<string, unknown>;
    // Never downgrade a completed lead back to partial (step-1 retries can arrive late).
    await env.DB.prepare(
      `INSERT INTO leads (lead_id, stage, created_at, updated_at, tier, score_total, route, name, email, phone, country, company, page, utm_source, utm_campaign, data, ip_hash)
       VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
       ON CONFLICT (lead_id) DO UPDATE SET
         stage = CASE WHEN leads.stage = 'complete' THEN 'complete' ELSE excluded.stage END,
         updated_at = excluded.updated_at, tier = excluded.tier, score_total = excluded.score_total, route = excluded.route,
         name = excluded.name, email = excluded.email, phone = excluded.phone, country = excluded.country,
         company = excluded.company, page = excluded.page, data = excluded.data`,
    ).bind(
      lead.lead_id, lead.stage, now, str(lead.score?.tier, 20), Math.max(0, Math.min(100, Number(lead.score?.total) || 0)), str(lead.route, 40),
      str(lead.name, 120), email, phone, str(lead.country, 40), str(lead.company, 160),
      str(lead.page, 200), str(ft.utm_source, 100), str(ft.utm_campaign, 100), JSON.stringify(lead).slice(0, MAX_BODY), ipHash,
    ).run();

    if (lead.stage === 'complete') ctx.waitUntil(notify(env, lead.lead_id));
    if (env.SHEET_WEBHOOK) ctx.waitUntil(fetch(env.SHEET_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(lead) }).then(() => {}, () => {}));
    return json({ ok: true, id: lead.lead_id });
  },

  async scheduled(_e: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Step-1-only enquiries: alert once they've been idle for 20 minutes.
    const cutoff = new Date(Date.now() - 20 * 60_000).toISOString();
    const { results } = await env.DB.prepare(`SELECT lead_id FROM leads WHERE notified_at IS NULL AND stage = 'partial' AND updated_at < ?1 LIMIT 20`).bind(cutoff).all<{ lead_id: string }>();
    ctx.waitUntil(Promise.all(results.map((r) => notify(env, r.lead_id))));
    // Retention: the privacy notice promises deletion 24 months after last contact.
    const expiry = new Date(Date.now() - 730 * 86_400_000).toISOString();
    ctx.waitUntil(env.DB.prepare('DELETE FROM leads WHERE updated_at < ?1').bind(expiry).run());
  },
};

// Sends one alert per lead (claims the row first so concurrent calls can't double-send).
async function notify(env: Env, id: string) {
  const claimed = await env.DB.prepare(`UPDATE leads SET notified_at = ?2 WHERE lead_id = ?1 AND notified_at IS NULL RETURNING data, stage`).bind(id, new Date().toISOString()).first<{ data: string; stage: string }>();
  if (!claimed || !env.LEAD_NOTIFY_TO) return;
  const d = JSON.parse(claimed.data) as Lead;
  const { subject, text, html } = buildAlert(d, claimed.stage !== 'complete');
  const replyTo = isEmail(str(d.email, 254)) ? str(d.email, 254) : '';
  const raw = mime({ from: FROM, to: env.LEAD_NOTIFY_TO, replyTo, subject, text, html });
  try {
    await env.LEAD_MAIL.send(new EmailMessage(FROM, env.LEAD_NOTIFY_TO, raw));
  } catch (err) {
    // Release the claim so the cron retries.
    await env.DB.prepare(`UPDATE leads SET notified_at = NULL WHERE lead_id = ?1`).bind(id).run();
    console.error('lead email failed', id, err);
  }
}
