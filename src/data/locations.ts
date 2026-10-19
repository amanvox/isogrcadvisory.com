// City landers. Each must carry genuinely local content (sectors, buyers, delivery notes)
// so they are useful pages, not doorway pages that only swap a city name.

export interface Location {
  slug: string;
  city: string;
  country: 'UAE' | 'Saudi Arabia';
  intro: string;
  sectors: string[];
  focusStandards: string[]; // standard slugs
  delivery: string; // TODO: confirm with partner which formats are actually available per city
}

export const locations: Location[] = [
  {
    slug: 'riyadh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    intro: 'Riyadh concentrates ministries, regional headquarters, financial institutions and the contractors that serve them. ISO requests here are usually triggered by tender prequalification, regulator expectations or a parent-company mandate.',
    sectors: ['Government & semi-government', 'Banking & fintech', 'Technology & telecom', 'Construction & giga-project contractors', 'Regional HQ operations'],
    focusStandards: ['iso-9001', 'iso-27001', 'iso-22301', 'iso-42001', 'iso-37001'],
    delivery: 'In-house training at your premises, virtual sessions, and consulting combining on-site and remote work.',
  },
  {
    slug: 'jeddah',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    intro: 'Jeddah’s port, logistics, food, hospitality and healthcare economy drives demand for quality, food safety and safety management systems — often to meet buyer and supply-chain requirements.',
    sectors: ['Ports, logistics & freight', 'Food manufacturing & distribution', 'Hospitality & tourism', 'Healthcare', 'Retail'],
    focusStandards: ['iso-9001', 'iso-22000', 'iso-45001', 'iso-14001', 'iso-55001'],
    delivery: 'In-house training at your premises, virtual sessions, and consulting combining on-site and remote work.',
  },
  {
    slug: 'dammam-khobar',
    city: 'Dammam & Al Khobar',
    country: 'Saudi Arabia',
    intro: 'The Eastern Province is the centre of energy, petrochemicals and industrial services. Contractors and vendors are routinely asked for integrated QHSE systems and trained internal auditors.',
    sectors: ['Oil, gas & petrochemical services', 'Industrial manufacturing', 'Engineering & maintenance contractors', 'Utilities', 'Testing & inspection labs'],
    focusStandards: ['iso-9001', 'iso-14001', 'iso-45001', 'iso-17025', 'iso-55001'],
    delivery: 'In-house training at your premises, virtual sessions, and consulting combining on-site and remote work.',
  },
  {
    slug: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    intro: 'Dubai’s government entities, banks, free-zone companies, developers and service providers ask for ISO for vendor registration, information security assurance and business continuity.',
    sectors: ['Government & free-zone authorities', 'Banking & financial services', 'Real estate & facilities management', 'Technology & managed services', 'Hospitality & aviation services'],
    focusStandards: ['iso-9001', 'iso-27001', 'iso-22301', 'iso-42001', 'iso-21001'],
    delivery: 'In-house training at your premises, public cohorts where scheduled, virtual sessions, and on-site consulting.',
  },
  {
    slug: 'abu-dhabi',
    city: 'Abu Dhabi',
    country: 'UAE',
    intro: 'Abu Dhabi’s energy, utilities, healthcare and government sectors set demanding supplier and regulatory requirements — integrated management systems, continuity and information security are common asks.',
    sectors: ['Energy & utilities', 'Government', 'Healthcare', 'Defence & industrial', 'Education'],
    focusStandards: ['iso-9001', 'iso-45001', 'iso-27001', 'iso-22301', 'iso-55001'],
    delivery: 'In-house training at your premises, virtual sessions, and on-site consulting.',
  },
  {
    slug: 'sharjah',
    city: 'Sharjah & Northern Emirates',
    country: 'UAE',
    intro: 'Manufacturing, trading, logistics and education providers in Sharjah and the Northern Emirates typically start with ISO 9001 and add environmental, safety or food safety standards as customers require.',
    sectors: ['Manufacturing', 'Trading & distribution', 'Logistics', 'Education & training providers', 'Food production'],
    focusStandards: ['iso-9001', 'iso-14001', 'iso-45001', 'iso-22000', 'iso-21001'],
    delivery: 'In-house training at your premises, virtual sessions, and on-site consulting.',
  },
];
