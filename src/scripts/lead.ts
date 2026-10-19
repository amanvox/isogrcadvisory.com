// Client-side lead plumbing: attribution capture, engagement signals, scoring and submission.
// No personal data is stored in the browser — only campaign/source parameters and page counts.

const FIRST = 'cd_first_touch';
const LAST = 'cd_last_touch';
const ENG = 'cd_engagement';

type Touch = Record<string, string>;

function safeGet(store: Storage, key: string) {
  try { return JSON.parse(store.getItem(key) || 'null'); } catch { return null; }
}
function safeSet(store: Storage, key: string, value: unknown) {
  try { store.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: ignore */ }
}

export function captureAttribution() {
  const params = new URLSearchParams(location.search);
  const touch: Touch = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'li_fat_id']) {
    const v = params.get(k);
    if (v) touch[k] = v.slice(0, 200);
  }
  const ref = document.referrer && !document.referrer.includes(location.host) ? document.referrer : '';
  if (ref) touch.referrer = ref.slice(0, 300);
  if (Object.keys(touch).length) {
    touch.landing = location.pathname;
    touch.at = new Date().toISOString();
    if (!safeGet(localStorage, FIRST)) safeSet(localStorage, FIRST, touch);
    safeSet(sessionStorage, LAST, touch);
  } else if (!safeGet(localStorage, FIRST)) {
    safeSet(localStorage, FIRST, { utm_source: '(direct)', landing: location.pathname, at: new Date().toISOString() });
  }

  const eng = safeGet(localStorage, ENG) || { views: 0, intentViews: 0, sessions: 0, readiness: null };
  if (!safeGet(sessionStorage, 'cd_session')) { eng.sessions += 1; safeSet(sessionStorage, 'cd_session', 1); }
  eng.views += 1;
  if (/^\/(iso|training|compliance-software|grc|workforce|locations)\//.test(location.pathname)) eng.intentViews += 1;
  safeSet(localStorage, ENG, eng);
}

export function recordReadiness(score: number, standard: string) {
  const eng = safeGet(localStorage, ENG) || { views: 0, intentViews: 0, sessions: 1 };
  eng.readiness = { score, standard };
  safeSet(localStorage, ENG, eng);
}

export function getContext() {
  return {
    first_touch: safeGet(localStorage, FIRST) || {},
    last_touch: safeGet(sessionStorage, LAST) || {},
    engagement: safeGet(localStorage, ENG) || {},
  };
}

// Scoring model — a starting hypothesis. Tune with real outcomes.
// Fit 0–40, Intent 0–40, Engagement 0–20. The score prioritises, it never replaces human review.
export function scoreLead(d: Record<string, string>) {
  let fit = 0, intent = 0, engagement = 0;

  if (d.country === 'UAE' || d.country === 'Saudi Arabia') fit += 15;
  if (d.company) fit += 5;
  fit += ({ 'decision-maker': 10, influencer: 6, researching: 2, individual: 3 } as Record<string, number>)[d.decision_role] ?? 0;
  fit += ({ '1-9': 0, '10-49': 3, '50-249': 7, '250-999': 10, '1000+': 10 } as Record<string, number>)[d.employees] ?? 0;
  fit = Math.min(fit, 40);

  if (d.route && d.route !== 'not-sure') intent += 10;
  intent += ({ 'under-3': 15, '3-6': 10, '6-12': 5, exploring: 0 } as Record<string, number>)[d.timeline] ?? 0;
  if (['tender', 'customer', 'regulator', 'renewal'].includes(d.trigger)) intent += 10;
  const pax = parseInt(d.participants || '0', 10);
  if (pax >= 5) intent += 10; else if (pax >= 2) intent += 5;
  if (d.route === 'compliance-software' && d.modules) intent += 5;
  intent = Math.min(intent, 40);

  const eng = getContext().engagement as { intentViews?: number; sessions?: number; readiness?: unknown };
  engagement += Math.min((eng.intentViews || 0) * 3, 9);
  if (eng.readiness || d.readiness_score) engagement += 8;
  if ((eng.sessions || 0) > 1) engagement += 3;
  engagement = Math.min(engagement, 20);

  const total = fit + intent + engagement;
  const tier = total >= 70 ? 'priority' : total >= 40 ? 'nurture' : 'self-serve';
  return { fit, intent, engagement, total, tier };
}

export function newLeadId() {
  const r = crypto.getRandomValues(new Uint32Array(2));
  return `L${Date.now().toString(36).toUpperCase()}-${r[0].toString(36).slice(0, 5).toUpperCase()}`;
}

// Same-origin endpoints (the site's own Worker) return a real status we can check.
// External Apps Script URLs don't answer CORS preflights, so those post text/plain with no-cors (opaque response).
export async function sendLead(endpoint: string, payload: Record<string, unknown>) {
  if (!endpoint) return false;
  if (endpoint.startsWith('/')) {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
    return res.ok;
  }
  await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  return true;
}

export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === 'function') w.gtag('event', event, params);
}
