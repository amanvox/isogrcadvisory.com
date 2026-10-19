// Builds the lead alert email (plain text + HTML) from a stored lead payload.
// Every value is user input: HTML is escaped and headers are stripped of line breaks.

type Lead = Record<string, unknown> & { lead_id: string; score?: { total?: number; tier?: string; fit?: number; intent?: number; engagement?: number } };

export const ROUTES: Record<string, string> = {
  'iso-consulting': 'ISO implementation / certification readiness',
  'iso-training': 'ISO auditor training',
  'other-training': 'Other professional training',
  'workforce-ld': 'Workforce, academy & L&D',
  'grc-consulting': 'GRC, risk, audit & regulatory compliance',
  'compliance-software': 'Choosing GRC / compliance software',
  'not-sure': 'Not sure yet',
};

// Readable labels for coded form values.
const VALUES: Record<string, Record<string, string>> = {
  decision_role: { 'decision-maker': 'Approves the budget', influencer: 'Recommends / evaluates', researching: 'Researching options', individual: 'Individual learner' },
  timeline: { 'under-3': 'Within 3 months', '3-6': '3–6 months', '6-12': '6–12 months', exploring: 'Just exploring' },
  trigger: { tender: 'Tender / prequalification', customer: 'Customer requirement', regulator: 'Regulator / parent company', renewal: 'Renewal / transition', internal: 'Internal improvement' },
  current_status: { starting: 'Starting from scratch', partial: 'Some processes documented', certified: 'Already certified (renewal / transition)', 'failed-audit': 'Audit findings to close' },
  buyer_type: { individual: 'Themselves', team: 'Their team / company' },
  format: { public: 'Public course', 'in-house': 'In-house', virtual: 'Virtual' },
};

const SECTIONS: [string, [string, string][]][] = [
  ['Contact', [['name', 'Name'], ['company', 'Organisation'], ['email', 'Email'], ['phone', 'Phone'], ['country', 'Country'], ['city', 'City'], ['contact_pref', 'Prefers']]],
  ['Requirement', [
    ['standards', 'Standards'], ['current_status', 'Current status'], ['sites', 'Sites'], ['frameworks', 'Frameworks'], ['grc_need', 'GRC need'],
    ['modules', 'Software areas'], ['users', 'Users'], ['current_tools', 'Current tools'], ['hosting', 'Hosting'],
    ['course', 'Course'], ['buyer_type', 'Booking for'], ['participants', 'Participants'], ['format', 'Format'], ['preferred_month', 'Preferred month'],
    ['ld_area', 'L&D area'], ['trigger', 'Trigger'], ['timeline', 'Timeline'], ['readiness_score', 'Readiness score'], ['message', 'Message'],
  ]],
  ['About them', [['decision_role', 'Role'], ['employees', 'Employees']]],
];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const val = (d: Lead, k: string) => {
  const v = d[k];
  if (typeof v !== 'string' && typeof v !== 'number') return '';
  const s = String(v).trim().slice(0, 1500);
  return VALUES[k]?.[s] ?? s;
};
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dubai', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (Dubai)';

export function buildAlert(d: Lead, partial: boolean) {
  const tier = String(d.score?.tier || 'unscored');
  const total = d.score?.total ?? '–';
  const route = ROUTES[val(d, 'route')] || val(d, 'route') || 'Enquiry';
  const ft = (d.first_touch || {}) as Record<string, string>;
  const eng = (d.engagement || {}) as Record<string, number>;
  const source = [ft.utm_source, ft.utm_medium, ft.utm_campaign].filter(Boolean).join(' / ') || ft.referrer || '(direct)';
  const phoneDigits = val(d, 'phone').replace(/[^\d]/g, '');
  const email = val(d, 'email');
  const received = when(String(d.submitted_at || new Date().toISOString()));

  const subject = `${partial ? '[Step 1 only] ' : ''}[${tier.toUpperCase()} ${total}] ${route} — ${val(d, 'name').slice(0, 60)}${val(d, 'company') ? ', ' + val(d, 'company').slice(0, 60) : ''}`;

  const sections = SECTIONS.map(([title, fields]) => [title, fields.map(([k, label]) => [label, val(d, k), k] as const).filter(([, v]) => v)] as const)
    .filter(([, rows]) => rows.length);
  const meta: [string, string][] = [
    ['Source', source],
    ['Landing page', ft.landing || ''],
    ['Form page', val(d, 'page')],
    ['Visits', eng.sessions ? `${eng.sessions} session(s), ${eng.intentViews ?? 0} service page views` : ''],
    ['Score', `${total} / 100 (fit ${d.score?.fit ?? '–'}, intent ${d.score?.intent ?? '–'}, engagement ${d.score?.engagement ?? '–'})`],
    ['Consent', `Contact: yes${val(d, 'consent_marketing') ? ' · Marketing: yes' : ' · Marketing: no'}`],
    ['Lead ID', d.lead_id],
    ['Received', received],
  ].filter(([, v]) => v) as [string, string][];

  // Plain text
  const text = [
    partial ? 'Only step 1 was completed. Contact details and consent were given.\n' : '',
    `${route}`,
    `${tier.toUpperCase()} · score ${total}/100 · ${received}`,
    '',
    ...sections.flatMap(([title, rows]) => [title.toUpperCase(), ...rows.map(([l, v]) => `  ${l.padEnd(16)} ${v}`), '']),
    'DETAILS',
    ...meta.map(([l, v]) => `  ${l.padEnd(16)} ${v}`),
    '',
    'Reply to this email to answer the enquirer directly.',
  ].join('\n');

  // HTML
  const tierColor = tier === 'priority' ? '#0F7481' : tier === 'nurture' ? '#9C7636' : '#5B6B7C';
  const link = (k: string, v: string) => {
    if (k === 'email' && email) return `<a href="mailto:${esc(email)}" style="color:#0F7481">${esc(v)}</a>`;
    if (k === 'phone' && phoneDigits.length >= 7)
      return `<a href="tel:+${phoneDigits}" style="color:#0F7481">${esc(v)}</a> &nbsp;·&nbsp; <a href="https://wa.me/${phoneDigits}" style="color:#0F7481">WhatsApp</a>`;
    return esc(v).replace(/\n/g, '<br>');
  };
  const rowsHtml = (rows: readonly (readonly [string, string, string?])[]) =>
    rows.map(([l, v, k]) => `<tr><td width="130" style="width:130px;padding:6px 12px 6px 0;color:#5B6B7C;vertical-align:top;font-size:13px">${esc(l)}</td><td style="padding:6px 0;font-size:14px;color:#0B1D30">${link(k || '', v)}</td></tr>`).join('');
  const block = (title: string, inner: string) =>
    `<tr><td style="padding:18px 24px 4px"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9C7636;font-weight:600">${esc(title)}</div><table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;border-collapse:collapse">${inner}</table></td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F3F5F7;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F5F7;padding:20px 0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #DCE1E6">
<tr><td style="background:#061A2E;padding:18px 24px;color:#fff">
  <div style="font-size:12px;color:#D9BC82;letter-spacing:.12em;text-transform:uppercase">New enquiry · isogrcadvisory.com</div>
  <div style="font-size:20px;font-weight:bold;margin-top:6px">${esc(route)}</div>
  <div style="margin-top:10px"><span style="display:inline-block;background:${tierColor};color:#fff;font-size:12px;font-weight:bold;padding:3px 8px;text-transform:uppercase">${esc(tier)} · ${esc(String(total))}/100</span>
  <span style="font-size:13px;color:#C9D3DD;margin-left:8px">${esc(received)}</span></div>
</td></tr>
${partial ? '<tr><td style="padding:12px 24px;background:#FFF6E5;color:#6B4E16;font-size:13px">Only step 1 was completed. Contact details and consent were given.</td></tr>' : ''}
${sections.map(([title, rows]) => block(title, rowsHtml(rows))).join('')}
${block('Details', rowsHtml(meta))}
<tr><td style="padding:18px 24px 22px;font-size:13px;color:#5B6B7C;border-top:1px solid #DCE1E6">Reply to this email to answer ${esc(val(d, 'name') || 'the enquirer')} directly.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}

export function mime(m: { from: string; to: string; replyTo: string; subject: string; text: string; html: string }) {
  const clean = (s: string) => s.replace(/[\r\n]+/g, ' ');
  const b64 = (s: string) => {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const wrap = (s: string) => b64(s).replace(/.{76}/g, '$&\r\n');
  const boundary = `b-${crypto.randomUUID()}`;
  return [
    `From: ISO GRC Advisory Leads <${m.from}>`,
    `To: ${clean(m.to)}`,
    ...(m.replyTo ? [`Reply-To: ${clean(m.replyTo)}`] : []),
    `Subject: =?UTF-8?B?${b64(clean(m.subject))}?=`,
    `Message-ID: <${crypto.randomUUID()}@isogrcadvisory.com>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap(m.text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap(m.html),
    `--${boundary}--`,
    '',
  ].join('\r\n');
}
