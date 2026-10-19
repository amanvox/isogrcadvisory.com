/**
 * Lead register: receives website enquiries and upserts them into a Google Sheet.
 *
 * Setup (≈10 minutes) — see README.md "Lead backend":
 *  1. Create a Google Sheet named "Lead Register". Extensions → Apps Script → paste this file.
 *  2. Set NOTIFY_EMAIL below. Run `setup` once from the editor and approve permissions.
 *  3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *  4. Copy the /exec URL into src/data/site.ts → leadEndpoint, rebuild, deploy.
 *
 * Step 1 of the form posts a "partial" row; step 2 updates the same row to "complete".
 * Handover to the delivery partner is manual: review the row, then set Handover status.
 */

const NOTIFY_EMAIL = 'you@example.com'; // TODO: your inbox
const SHEET = 'Leads';

// Intended handover owner per enquiry route. Fill in your own copy in Apps Script; keep real names out of the repo.
const PARTNERS = {
  'iso-consulting': 'Partner (ISO)',
  'iso-training': 'Partner (training)',
  'other-training': 'Partner (training)',
  'workforce-ld': 'Partner (training)',
  'grc-consulting': 'Partner (GRC)',
  'compliance-software': 'Partner (software)',
  'not-sure': 'Owner triage',
};

const COLUMNS = [
  'lead_id', 'stage', 'submitted_at', 'tier', 'score_total', 'score_fit', 'score_intent', 'score_engagement',
  'route', 'intended_partner', 'name', 'company', 'email', 'phone', 'country', 'city', 'decision_role', 'employees',
  'timeline', 'trigger', 'current_status', 'standards', 'sites', 'course', 'buyer_type', 'participants', 'format',
  'preferred_month', 'ld_area', 'modules', 'users', 'current_tools', 'hosting', 'frameworks', 'grc_need', 'message', 'contact_pref', 'readiness_score',
  'consent_service', 'consent_marketing', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
  'gclid', 'referrer', 'landing_page', 'sessions', 'intent_page_views',
  // Manual pipeline columns — edited by you, never overwritten by the script
  'owner', 'handover_status', 'handover_date', 'partner_feedback', 'outcome', 'value_estimate', 'notes',
];
const MANUAL = ['owner', 'handover_status', 'handover_date', 'partner_feedback', 'outcome', 'value_estimate', 'notes'];

function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  sh.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
  sh.setFrozenRows(1);
  const statusCol = COLUMNS.indexOf('handover_status') + 1;
  sh.getRange(2, statusCol, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Qualifying', 'Sent to partner', 'Accepted', 'Rejected', 'Proposal', 'Won', 'Lost', 'Spam'])
      .build(),
  );
  const outcomeCol = COLUMNS.indexOf('outcome') + 1;
  sh.getRange(2, outcomeCol, 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Open', 'Won', 'Lost', 'No response', 'Not a fit']).build(),
  );
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return ok(); // honeypot
    const row = flatten(d);
    const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
    const ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().map((r) => r[0]);
    const idx = ids.indexOf(row.lead_id);
    if (idx === -1) {
      row.handover_status = 'New';
      row.outcome = 'Open';
      sh.appendRow(COLUMNS.map((c) => row[c] ?? ''));
    } else {
      const r = idx + 2;
      const existing = sh.getRange(r, 1, 1, COLUMNS.length).getValues()[0];
      const merged = COLUMNS.map((c, i) => (MANUAL.includes(c) ? existing[i] : row[c] ?? existing[i]));
      sh.getRange(r, 1, 1, COLUMNS.length).setValues([merged]);
    }
    if (row.stage === 'complete') notify(row);
    return ok();
  } finally {
    lock.releaseLock();
  }
}

function flatten(d) {
  const ft = d.first_touch || {};
  const lt = d.last_touch || {};
  const eng = d.engagement || {};
  const s = d.score || {};
  const clean = (v) => (typeof v === 'string' ? v.replace(/^[=+\-@]/, "'$&").slice(0, 2000) : v); // block formula injection
  const out = {};
  Object.keys(d).forEach((k) => { if (typeof d[k] !== 'object') out[k] = clean(d[k]); });
  return Object.assign(out, {
    tier: s.tier, score_total: s.total, score_fit: s.fit, score_intent: s.intent, score_engagement: s.engagement,
    intended_partner: PARTNERS[d.route] || '',
    utm_source: clean(lt.utm_source || ft.utm_source || ''),
    utm_medium: clean(lt.utm_medium || ft.utm_medium || ''),
    utm_campaign: clean(lt.utm_campaign || ft.utm_campaign || ''),
    utm_term: clean(lt.utm_term || ft.utm_term || ''),
    gclid: clean(lt.gclid || ft.gclid || ''),
    referrer: clean(ft.referrer || ''),
    landing_page: clean(ft.landing || ''),
    sessions: eng.sessions || '',
    intent_page_views: eng.intentViews || '',
  });
}

function notify(r) {
  const flag = r.tier === 'priority' ? '🔥 PRIORITY' : r.tier === 'nurture' ? 'Warm' : 'Info';
  const subject = `[${flag}] ${r.route} — ${r.company || r.name} (${r.country}) · score ${r.score_total}`;
  const lines = COLUMNS.filter((c) => !MANUAL.includes(c) && r[c] !== undefined && r[c] !== '').map((c) => `${c}: ${r[c]}`);
  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n') + `\n\nOpen the register: ${SpreadsheetApp.getActive().getUrl()}`);
}

function ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
