// Single source of truth for brand, contact, routing and launch flags.
// Everything marked TODO must be confirmed before launch.

export const site = {
  // Standalone brand. No provider or personal names appear in customer-facing copy.
  name: 'ISO GRC Advisory',
  tagline: 'ISO advisory, GRC advisory and professional training for the UAE and Saudi Arabia',
  url: 'https://isogrcadvisory.com', // domain being purchased; also set in astro.config.mjs and public/robots.txt
  locale: 'en',

  contact: {
    email: 'hello@isogrcadvisory.com', // Cloudflare Email Routing forwards this address
    phoneUAE: '+971564039650', // TODO: confirm this number may be published for the brand
    phoneKSA: '+966546351297', // TODO: confirm this number may be published for the brand
    whatsapp: '971564039650', // digits only, used for wa.me links
  },
  // Email is shown only once it is a real address (not the example.com placeholder).
  get showEmail() { return !this.contact.email.endsWith('example.com'); },

  // Neutral brand statement shown in the footer and About page.
  disclosure:
    'ISO GRC Advisory provides ISO readiness advice, governance, risk and compliance advisory, and auditor and professional training. We do not issue ISO certificates. Organisational certification is carried out by independent certification bodies.',

  // One approved proof point for the home page. Leave empty until confirmed in writing —
  // nothing renders while it is empty. Example shape: { stat: '…', text: '…' }.
  proof: null as null | { stat: string; text: string },

  // Cities shown in the hero strip and footer. TODO: keep only cities you can genuinely serve.
  servedCities: ['riyadh', 'jeddah', 'dammam-khobar', 'dubai', 'abu-dhabi', 'sharjah'],

  // Lead endpoint: the Worker in worker/index.ts (stores in D1 and emails an alert).
  // Set to '' to fall back to a WhatsApp handoff.
  leadEndpoint: '/api/lead',

  // Analytics only load after the visitor accepts the consent banner AND an ID is set.
  analytics: {
    ga4Id: '', // e.g. 'G-XXXXXXX'
  },

  markets: ['United Arab Emirates', 'Saudi Arabia'],
};

export const routes = [
  { id: 'iso-consulting', label: 'ISO implementation / certification readiness' },
  { id: 'iso-training', label: 'ISO auditor training (internal / lead auditor)' },
  { id: 'other-training', label: 'Other professional training' },
  { id: 'workforce-ld', label: 'Workforce, academy & L&D' },
  { id: 'grc-consulting', label: 'GRC, risk, audit & regulatory compliance' },
  { id: 'compliance-software', label: 'Choosing GRC / compliance software' },
  { id: 'not-sure', label: 'Not sure yet' },
] as const;

export const nav = [
  // Three service lines, named in full so the acronym-heavy brand stays easy to navigate.
  { href: '/iso/', label: 'ISO Advisory', match: ['/iso/'] },
  { href: '/grc/', label: 'GRC Advisory', match: ['/grc/', '/compliance-software/'] },
  { href: '/training/', label: 'Training', match: ['/training/', '/workforce/'] },
  { href: '/resources/', label: 'Resources', match: ['/resources/'] },
];
