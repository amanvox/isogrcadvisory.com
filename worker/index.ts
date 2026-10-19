// Lead capture for the static site. Only /api/* reaches this Worker (run_worker_first);
// everything else is served straight from static assets.
//
// POST /api/lead  → validate, upsert into D1, email an alert when the enquiry is complete.
// Cron (every 15 min) → alert for step-1-only enquiries that were never completed.
//
// Secrets (wrangler secret put): LEAD_NOTIFY_TO (verified Email Routing destination),
// optional SHEET_WEBHOOK (Google Apps Script /exec URL to mirror rows into a Sheet).

import { EmailMessage } from 'cloudflare:email';

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Database;
  LEAD_MAIL: { send: (msg: EmailMessage) => Promise<void> };
  LEAD_NOTIFY_TO: string;
  SHEET_WEBHOOK?: string;
}
type D1Database = {
  prepare: (sql: string) => { bind: (...v: unknown[]) => { run: () => Promise<unknown>; first: <T>() => Promise<T | null>; all: <T>() => Promise<{ results: T[] }> } };
};
type Lead = Record<string, unknown> & { lead_id: string; stage: 'partial' | 'complete'; score?: { total?: number; tier?: string } };

const FROM = 'leads@isogrcadvisory.com';
const ALLOWED_HOSTS = /^(www\.)?isogrcadvisory\.com$|\.workers\.dev$|^localhost$|^127\.0\.0\.1$/;
const ROUTES: Record<string, string> = {
  'iso-consulting': 'ISO implementation / certification readiness',
  'iso-training': 'ISO auditor training',
  'other-training': 'Other professional training',
  'workforce-ld': 'Workforce, academy & L&D',
  'grc-consulting': 'GRC, risk, audit & regulatory compliance',
  'compliance-software': 'Choosing GRC / compliance software',
  'not-sure': 'Not sure yet',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname !== '/api/lead') return env.ASSETS.fetch(req);
    if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

    const origin = req.headers.get('Origin');
    if (origin && !ALLOWED_HOSTS.test(new URL(origin).hostname)) return json({ ok: false, error: 'origin' }, 403);
    if (Number(req.headers.get('Content-Length') || 0) > 32_000) return json({ ok: false, error: 'size' }, 413);

    let lead: Lead;
    try { lead = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }

    // Honeypot: pretend success so bots don't retry.
    if (str(lead.website)) return json({ ok: true });
    if (!/^L[A-Z0-9]{4,12}-[A-Z0-9]{1,8}$/.test(str(lead.lead_id, 40))) return json({ ok: false, error: 'id' }, 400);
    if (lead.stage !== 'partial' && lead.stage !== 'complete') return json({ ok: false, error: 'stage' }, 400);
    if (!str(lead.name) || (!str(lead.email) && !str(lead.phone)) || !str(lead.consent_service)) return json({ ok: false, error: 'fields' }, 422);

    const now = new Date().toISOString();
    const ft = (lead.first_touch || {}) as Record<string, unknown>;
    // Never downgrade a completed lead back to partial (step-1 retries can arrive late).
    await env.DB.prepare(
      `INSERT INTO leads (lead_id, stage, created_at, updated_at, tier, score_total, route, name, email, phone, country, company, page, utm_source, utm_campaign, data)
       VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
       ON CONFLICT (lead_id) DO UPDATE SET
         stage = CASE WHEN leads.stage = 'complete' THEN 'complete' ELSE excluded.stage END,
         updated_at = excluded.updated_at, tier = excluded.tier, score_total = excluded.score_total, route = excluded.route,
         name = excluded.name, email = excluded.email, phone = excluded.phone, country = excluded.country,
         company = excluded.company, page = excluded.page, data = excluded.data`,
    ).bind(
      lead.lead_id, lead.stage, now, str(lead.score?.tier, 20), Number(lead.score?.total) || 0, str(lead.route, 40),
      str(lead.name, 120), str(lead.email, 160), str(lead.phone, 40), str(lead.country, 40), str(lead.company, 160),
      str(lead.page, 200), str(ft.utm_source, 100), str(ft.utm_campaign, 100), JSON.stringify(lead).slice(0, 30_000),
    ).run();

    if (lead.stage === 'complete') ctx.waitUntil(notify(env, lead.lead_id));
    if (env.SHEET_WEBHOOK) ctx.waitUntil(fetch(env.SHEET_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(lead) }).then(() => {}, () => {}));
    return json({ ok: true, id: lead.lead_id });
  },

  // Step-1-only enquiries: alert once they've been idle for 20 minutes.
  async scheduled(_e: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const cutoff = new Date(Date.now() - 20 * 60_000).toISOString();
    const { results } = await env.DB.prepare(`SELECT lead_id FROM leads WHERE notified_at IS NULL AND stage = 'partial' AND updated_at < ?1 LIMIT 20`).bind(cutoff).all<{ lead_id: string }>();
    ctx.waitUntil(Promise.all(results.map((r) => notify(env, r.lead_id))));
  },
};

// Sends one alert per lead (claims the row first so concurrent calls can't double-send).
async function notify(env: Env, id: string) {
  const claimed = await env.DB.prepare(`UPDATE leads SET notified_at = ?2 WHERE lead_id = ?1 AND notified_at IS NULL RETURNING data, stage`).bind(id, new Date().toISOString()).first<{ data: string; stage: string }>();
  if (!claimed || !env.LEAD_NOTIFY_TO) return;
  const d = JSON.parse(claimed.data) as Lead;
  const tier = str(d.score?.tier) || 'unscored';
  const route = ROUTES[str(d.route)] || str(d.route);
  const partial = claimed.stage !== 'complete';
  const subject = `${partial ? '[Step 1 only] ' : ''}[${tier.toUpperCase()}] ${route} — ${str(d.name, 60)}${d.company ? ', ' + str(d.company, 60) : ''}`;

  const skip = new Set(['lead_id', 'stage', 'score', 'first_touch', 'last_touch', 'engagement', 'website', 'submitted_at']);
  const lines = Object.entries(d)
    .filter(([k, v]) => !skip.has(k) && v !== '' && v != null && typeof v !== 'object')
    .map(([k, v]) => `${k.replace(/_/g, ' ').padEnd(18)} ${String(v).slice(0, 1000)}`);
  const ft = (d.first_touch || {}) as Record<string, string>;
  const source = [ft.utm_source, ft.utm_medium, ft.utm_campaign].filter(Boolean).join(' / ') || str(ft.referrer) || 'direct';
  const body = [
    partial ? 'The visitor completed step 1 but not step 2. Contact details and consent were given.\n' : '',
    `Lead ${d.lead_id}  ·  score ${d.score?.total ?? '-'} (${tier})  ·  source: ${source}`,
    '',
    ...lines,
    '',
    'Reply to this email to answer the enquirer directly.',
  ].join('\n');

  const replyTo = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(str(d.email)) ? str(d.email) : '';
  const raw = mime({ from: FROM, to: env.LEAD_NOTIFY_TO, replyTo, subject, body });
  try {
    await env.LEAD_MAIL.send(new EmailMessage(FROM, env.LEAD_NOTIFY_TO, raw));
  } catch (err) {
    // Release the claim so the cron retries.
    await env.DB.prepare(`UPDATE leads SET notified_at = NULL WHERE lead_id = ?1`).bind(id).run();
    console.error('lead email failed', id, err);
  }
}

function mime(m: { from: string; to: string; replyTo: string; subject: string; body: string }) {
  const clean = (s: string) => s.replace(/[\r\n]+/g, ' ');
  const b64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const bodyB64 = b64(m.body).replace(/.{76}/g, '$&\r\n');
  return [
    `From: ISO GRC Advisory Leads <${m.from}>`,
    `To: ${clean(m.to)}`,
    ...(m.replyTo ? [`Reply-To: ${clean(m.replyTo)}`] : []),
    `Subject: =?UTF-8?B?${b64(clean(m.subject))}?=`,
    `Message-ID: <${crypto.randomUUID()}@isogrcadvisory.com>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    bodyB64,
  ].join('\r\n');
}
