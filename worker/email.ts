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

  // HTML: table layout with inline styles only (email clients ignore <style> blocks and flexbox).
  const C = { navy: '#061A2E', ink: '#0B1D30', muted: '#5B6B7C', line: '#DCE1E6', band: '#F3F5F7', teal: '#0F7481', gold: '#9C7636', brass: '#D9BC82' };
  const tierColor = tier === 'priority' ? C.teal : tier === 'nurture' ? C.gold : C.muted;
  const font = 'font-family:Arial,Helvetica,sans-serif;';
  const cellValue = (k: string, v: string) => {
    if (k === 'email' && email) return `<a href="mailto:${esc(email)}" style="color:${C.teal};text-decoration:none">${esc(v)}</a>`;
    if (k === 'phone' && phoneDigits.length >= 7) return `<a href="tel:+${phoneDigits}" style="color:${C.teal};text-decoration:none">${esc(v)}</a>`;
    return esc(v).replace(/\n/g, '<br>');
  };
  const table = (title: string, rows: readonly (readonly [string, string, string?])[]) => `
<tr><td style="padding:22px 28px 0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid ${C.line}">
    <tr><td colspan="2" style="${font}background:${C.band};border-bottom:1px solid ${C.line};padding:9px 14px;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${C.gold}">${esc(title)}</td></tr>
    ${rows.map(([l, v, k], i) => `<tr>
      <td width="34%" style="${font}width:34%;padding:10px 14px;font-size:13px;color:${C.muted};vertical-align:top;border-top:${i ? `1px solid ${C.line}` : '0'};background:#FBFCFD">${esc(l)}</td>
      <td style="${font}padding:10px 14px;font-size:14px;line-height:1.5;color:${C.ink};vertical-align:top;border-top:${i ? `1px solid ${C.line}` : '0'};border-left:1px solid ${C.line}">${cellValue(k || '', v)}</td>
    </tr>`).join('')}
  </table>
</td></tr>`;
  const button = (href: string, label: string, primary: boolean) =>
    `<td style="padding:0 8px 8px 0"><a href="${esc(href)}" style="${font}display:inline-block;padding:10px 18px;font-size:13px;font-weight:bold;text-decoration:none;${primary ? `background:${C.teal};color:#ffffff;border:1px solid ${C.teal}` : `background:#ffffff;color:${C.teal};border:1px solid ${C.teal}`}">${esc(label)}</a></td>`;
  const actions = [
    email ? button(`mailto:${email}?subject=${encodeURIComponent('Re: your enquiry to ISO GRC Advisory')}`, 'Reply by email', true) : '',
    phoneDigits.length >= 7 ? button(`https://wa.me/${phoneDigits}`, 'WhatsApp', !email) : '',
    phoneDigits.length >= 7 ? button(`tel:+${phoneDigits}`, 'Call', false) : '',
  ].join('');
  const stat = (label: string, value: string, color = '#ffffff') =>
    `<td style="${font}padding:12px 16px 0 0;vertical-align:top"><div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#8FA3B8">${esc(label)}</div><div style="font-size:15px;font-weight:bold;color:${color};margin-top:3px">${esc(value)}</div></td>`;

  const html = `<!doctype html><html><head><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:${C.band}">
<div style="display:none;max-height:0;overflow:hidden">${esc(`${val(d, 'name')}${val(d, 'company') ? ', ' + val(d, 'company') : ''} · ${val(d, 'country')} · ${tier} ${total}/100`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.band};padding:24px 12px"><tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid ${C.line};border-collapse:collapse">

<tr><td style="background:${C.navy};padding:22px 28px 20px;border-bottom:3px solid ${C.brass}">
  <div style="${font}font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:${C.brass}">ISO GRC Advisory · New enquiry</div>
  <div style="${font}font-size:22px;line-height:1.3;font-weight:bold;color:#ffffff;margin-top:8px">${esc(route)}</div>
  <div style="${font}font-size:15px;color:#C9D3DD;margin-top:4px">${esc(val(d, 'name'))}${val(d, 'company') ? ' · ' + esc(val(d, 'company')) : ''}${val(d, 'country') ? ' · ' + esc(val(d, 'country')) : ''}</div>
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="${font}padding:14px 16px 0 0;vertical-align:top"><span style="display:inline-block;background:${tierColor};color:#ffffff;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;padding:6px 10px">${esc(tier)} · ${esc(String(total))}/100</span></td>
    ${stat('Timeline', val(d, 'timeline') || '–')}
    ${stat('Received', received.replace(' (Dubai)', ''))}
  </tr></table>
</td></tr>

${partial ? `<tr><td style="${font}padding:12px 28px;background:#FFF6E5;color:#6B4E16;font-size:13px;border-bottom:1px solid #F1DFB8">Only step 1 was completed. Contact details and consent were given; the optional questions were skipped.</td></tr>` : ''}
${actions ? `<tr><td style="padding:20px 28px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${actions}</tr></table></td></tr>` : ''}
${sections.map(([title, rows]) => table(title, rows)).join('')}
${table('Lead details', meta.map(([l, v]) => [l, v] as const))}

<tr><td style="${font}padding:22px 28px 26px;font-size:12px;line-height:1.6;color:${C.muted}">
  Replying to this email goes straight to ${esc(val(d, 'name') || 'the enquirer')}.<br>
  Stored in the lead register as <span style="color:${C.ink}">${esc(d.lead_id)}</span>.
</td></tr>
</table>
</td></tr></table>
</body></html>`;

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
