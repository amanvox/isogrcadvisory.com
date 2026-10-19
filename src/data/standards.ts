// ISO standard landing pages. `launch: false` keeps a page out of navigation, sitemap
// and hubs until delivery is confirmed.
// Outcome type matters: some standards lead to certification, 17025 to accreditation,
// and guidance standards (31000, 30414) to neither — copy must stay accurate to that.

export type Outcome = 'certification' | 'accreditation' | 'guidance';

export interface Standard {
  slug: string;
  code: string;
  name: string;
  family: 'Quality & Operations' | 'Risk, Security & Continuity' | 'HSE & Sustainability' | 'People & Learning' | 'AI & Technology';
  outcome: Outcome;
  launch: boolean;
  summary: string;
  whoNeedsIt: string[];
  regionalDrivers: { uae: string; ksa: string };
  courses: string[];
  faqs: { q: string; a: string }[];
}

export const standards: Standard[] = [
  {
    slug: 'iso-9001',
    code: 'ISO 9001:2015',
    name: 'Quality Management System (QMS)',
    family: 'Quality & Operations',
    outcome: 'certification',
    launch: true,
    summary:
      'One of the most widely adopted management system standards. It gives you documented, repeatable processes, measurable customer satisfaction and a structured way to fix recurring problems.',
    whoNeedsIt: [
      'Contractors and suppliers bidding for government, semi-government or large corporate work',
      'SMEs scaling past the point where the founder can personally check quality',
      'Organisations that already hold another ISO standard and want an integrated system',
    ],
    regionalDrivers: {
      uae: 'Commonly requested in vendor registration for federal and emirate-level entities, utilities and large developers, and often the first step toward an integrated management system (IMS).',
      ksa: 'Frequently asked for in tender prequalification and supplier registration with government and large energy buyers; a practical foundation for Vision 2030-era growth and local-content programmes.',
    },
    courses: ['ISO 9001 Foundation', 'ISO 9001 Internal Auditor', 'ISO 9001 Lead Auditor', 'ISO 9001 Implementation'],
    faqs: [
      { q: 'How long does ISO 9001 implementation take?', a: 'For most small and mid-sized organisations, preparation typically runs over several months depending on size, sites and how much is already documented. A scoping call gives you a realistic plan for your situation.' },
      { q: 'Do you issue the ISO 9001 certificate?', a: 'No. Preparation, training and advisory are separate from certification. Your certificate is issued by an independent, accredited certification body after its own audit.' },
      { q: 'Can ISO 9001 be combined with ISO 14001 and ISO 45001?', a: 'Yes. The three share a common high-level structure and are often implemented together as an integrated management system with one set of shared procedures and audits.' },
    ],
  },
  {
    slug: 'iso-27001',
    code: 'ISO/IEC 27001:2022',
    name: 'Information Security Management System (ISMS)',
    family: 'Risk, Security & Continuity',
    outcome: 'certification',
    launch: true,
    summary:
      'A risk-based framework for protecting information — people, process and technology controls, backed by evidence an auditor (or a customer’s security team) can verify.',
    whoNeedsIt: [
      'Technology, SaaS, fintech and managed-service providers asked for security assurance',
      'Organisations handling customer or government data',
      'Teams consolidating overlapping national-framework and customer security questionnaires',
    ],
    regionalDrivers: {
      uae: 'Often mapped alongside UAE Information Assurance requirements and sector frameworks (for example Dubai’s information security regulations and health-sector standards).',
      ksa: 'Commonly aligned with NCA Essential Cybersecurity Controls (ECC) and, for financial institutions, the SAMA Cybersecurity Framework — one ISMS can provide much of the evidence these require.',
    },
    courses: ['ISO 27001 Foundation', 'ISO 27001 Internal Auditor', 'ISO 27001 Lead Auditor', 'ISO 27001 Lead Implementer'],
    faqs: [
      { q: 'We are still on the 2013 version — what now?', a: 'The transition period to ISO/IEC 27001:2022 has ended, so certificates now need to be to the 2022 edition. A gap assessment against the updated Annex A controls is the usual starting point.' },
      { q: 'Does ISO 27001 replace NCA ECC or UAE IA compliance?', a: 'No — they are separate obligations — but a well-built ISMS can supply much of the governance, risk assessment and control evidence they ask for, which reduces duplicated effort.' },
    ],
  },
  {
    slug: 'iso-22301',
    code: 'ISO 22301:2019',
    name: 'Business Continuity Management System (BCMS)',
    family: 'Risk, Security & Continuity',
    outcome: 'certification',
    launch: true,
    summary:
      'Prepare for disruption before it happens: business impact analysis, recovery strategies, tested plans and a management system that keeps them current.',
    whoNeedsIt: [
      'Banks, insurers, utilities, telecoms and government entities',
      'Service providers with contractual uptime or recovery commitments',
      'Organisations that have plans on paper but have never exercised them',
    ],
    regionalDrivers: {
      uae: 'Closely related to the national business continuity standard (NCEMA 7000) applied across many UAE government and critical entities.',
      ksa: 'Supports business continuity expectations in sector regulation such as SAMA’s requirements for financial institutions and national resilience programmes.',
    },
    courses: ['ISO 22301 Foundation', 'ISO 22301 Internal Auditor', 'ISO 22301 Lead Auditor', 'Business Impact Analysis (BIA) Workshop', 'Advanced Business Continuity & Disaster Recovery'],
    faqs: [
      { q: 'What is a Business Impact Analysis?', a: 'A BIA identifies your critical activities, how quickly each must recover and what it depends on. It is the foundation every continuity strategy and plan is built on.' },
    ],
  },
  {
    slug: 'iso-42001',
    code: 'ISO/IEC 42001:2023',
    name: 'Artificial Intelligence Management System (AIMS)',
    family: 'AI & Technology',
    outcome: 'certification',
    launch: true,
    summary:
      'The first certifiable management system standard for AI — governance, risk and impact assessment, and lifecycle controls for organisations that build or use AI systems.',
    whoNeedsIt: [
      'Organisations deploying AI in customer-facing or decision-making processes',
      'AI vendors asked by clients to demonstrate responsible-AI governance',
      'Risk, compliance and internal audit teams who need to audit AI use',
    ],
    regionalDrivers: {
      uae: 'Fits the UAE’s national AI strategy agenda and the growing number of government and enterprise buyers asking vendors how their AI is governed.',
      ksa: 'Complements SDAIA’s AI ethics principles and the broader national data and AI agenda, giving a structured, auditable way to show responsible AI use.',
    },
    courses: ['ISO 42001 Lead Auditor', 'AI for Business Leaders', 'Generative AI for Digital Transformation'],
    faqs: [
      { q: 'Do we need ISO 42001 if we only use third-party AI tools?', a: 'Many organisations start by governing the AI they consume rather than build. The standard scales to that scope — an initial readiness review clarifies what is in and out.' },
    ],
  },
  {
    slug: 'iso-14001',
    code: 'ISO 14001:2015',
    name: 'Environmental Management System (EMS)',
    family: 'HSE & Sustainability',
    outcome: 'certification',
    launch: true,
    summary:
      'Identify and control your environmental aspects, meet legal obligations and build credible data for ESG and sustainability reporting.',
    whoNeedsIt: ['Construction, manufacturing, logistics and facilities management firms', 'Suppliers to energy, utilities and giga-projects', 'Organisations starting ESG reporting'],
    regionalDrivers: {
      uae: 'Increasingly expected by developers, utilities and public buyers as sustainability commitments move into procurement criteria.',
      ksa: 'Commonly requested by large project owners and energy-sector buyers, and aligned with the Saudi Green Initiative direction of travel.',
    },
    courses: ['ISO 14001 Foundation', 'ISO 14001 Lead Auditor', 'Carbon Footprint Measurement & Reduction', 'Certified ESG Professional'],
    faqs: [],
  },
  {
    slug: 'iso-45001',
    code: 'ISO 45001:2018',
    name: 'Occupational Health & Safety Management System (OH&S)',
    family: 'HSE & Sustainability',
    outcome: 'certification',
    launch: true,
    summary: 'A proactive system for preventing injuries and ill health: hazard identification, worker participation, legal compliance and continual improvement.',
    whoNeedsIt: ['Contractors and subcontractors on major projects', 'Manufacturing, oil & gas services, logistics and facilities companies', 'Any organisation with significant field or site workforce'],
    regionalDrivers: {
      uae: 'Frequently a prequalification requirement from main contractors, developers and utilities.',
      ksa: 'Frequently requested by project owners and energy-sector buyers for contractors working on site.',
    },
    courses: ['ISO 45001 Lead Auditor', 'Hazard Identification & Risk Assessment (HIRA)', 'HSE Leadership & Risk Management'],
    faqs: [],
  },
  {
    slug: 'iso-22000',
    code: 'ISO 22000:2018',
    name: 'Food Safety Management System (FSMS)',
    family: 'HSE & Sustainability',
    outcome: 'certification',
    launch: true,
    summary: 'Combines HACCP principles with a management system so food safety is controlled across the whole chain, from suppliers to service.',
    whoNeedsIt: ['Food manufacturers, bottlers and packagers', 'Catering, hospitality and central kitchens', 'Food importers, distributors and cold-chain logistics'],
    regionalDrivers: {
      uae: 'Supports municipal food safety requirements and is commonly asked for by retail, hospitality and airline buyers.',
      ksa: 'Supports SFDA food safety expectations and the scale-up of local food manufacturing and hospitality.',
    },
    courses: ['ISO 22000 Internal Auditor', 'ISO 22000 Lead Auditor'],
    faqs: [],
  },
  {
    slug: 'iso-17025',
    code: 'ISO/IEC 17025:2017',
    name: 'Testing & Calibration Laboratories',
    family: 'Quality & Operations',
    outcome: 'accreditation',
    launch: true,
    summary: 'The competence standard for testing and calibration laboratories. Labs are accredited — not certified — to ISO/IEC 17025 by a national accreditation body.',
    whoNeedsIt: ['Testing, inspection and calibration labs', 'In-house labs at manufacturers, utilities and healthcare providers', 'Labs whose results are used for regulatory or contractual decisions'],
    regionalDrivers: {
      uae: 'Accreditation in the UAE is granted by the national accreditation body (EIAC).',
      ksa: 'Accreditation in Saudi Arabia is granted by the national accreditation body (SAAC).',
    },
    courses: ['ISO 17025 Foundation', 'ISO 17025 Lead Auditor', 'Uncertainty of Measurement Workshop'],
    faqs: [
      { q: 'Is ISO 17025 a certification?', a: 'No. Laboratories are accredited to ISO/IEC 17025 by a national accreditation body after an assessment of technical competence. Preparation and training help you get ready for that assessment.' },
    ],
  },
  {
    slug: 'iso-21001',
    code: 'ISO 21001:2018',
    name: 'Educational Organisations Management System (EOMS)',
    family: 'People & Learning',
    outcome: 'certification',
    launch: true,
    summary: 'A management system for organisations that deliver education or training — schools, universities, corporate academies and training providers.',
    whoNeedsIt: ['Corporate academies and internal training departments', 'Private schools, institutes and universities', 'Training providers seeking a recognised quality framework'],
    regionalDrivers: {
      uae: 'Relevant to corporate academies and training providers building recognised, learner-centred quality systems.',
      ksa: 'Relevant to the rapid growth of corporate academies and training providers under the Human Capability Development Program.',
    },
    courses: ['ISO 21001 Lead Auditor', 'Train the Trainer'],
    faqs: [],
  },
  {
    slug: 'iso-29993',
    code: 'ISO 29993:2017',
    name: 'Learning Services Outside Formal Education',
    family: 'People & Learning',
    outcome: 'certification',
    launch: true,
    summary: 'Quality requirements for learning services such as corporate training, vocational programmes and professional courses.',
    whoNeedsIt: ['Training companies and course providers', 'Internal L&D teams delivering programmes to employees or partners'],
    regionalDrivers: {
      uae: 'A practical quality benchmark for training providers and in-house academies.',
      ksa: 'A practical quality benchmark for the growing training-provider and academy market.',
    },
    courses: [],
    faqs: [],
  },
  {
    slug: 'iso-30414',
    code: 'ISO 30414',
    name: 'Human Capital Reporting',
    family: 'People & Learning',
    outcome: 'guidance',
    launch: true,
    summary: 'Guidelines for internal and external reporting on human capital — workforce cost, productivity, skills, leadership, diversity and more.',
    whoNeedsIt: ['HR leaders building workforce dashboards for boards', 'Listed and government-linked entities expanding ESG “S” reporting'],
    regionalDrivers: {
      uae: 'Supports Emiratisation and workforce reporting with a consistent metric set.',
      ksa: 'Supports Saudisation and workforce reporting with a consistent metric set.',
    },
    courses: [],
    faqs: [{ q: 'Can we be certified to ISO 30414?', a: 'ISO 30414 is a guidance standard, so it is implemented rather than certified in the usual sense. The value is a consistent, comparable set of human capital metrics.' }],
  },
  {
    slug: 'iso-37001',
    code: 'ISO 37001',
    name: 'Anti-Bribery Management System (ABMS)',
    family: 'Risk, Security & Continuity',
    outcome: 'certification',
    launch: true,
    summary: 'Controls to prevent, detect and respond to bribery — due diligence, financial and commercial controls, reporting channels and investigations.',
    whoNeedsIt: ['Organisations in high-value procurement and contracting', 'Government entities and government-linked companies', 'Companies with large third-party and agent networks'],
    regionalDrivers: { uae: 'Increasingly referenced in governance and integrity programmes.', ksa: 'Complements national anti-corruption and integrity expectations in procurement.' },
    courses: ['ISO 37001 Lead Auditor'],
    faqs: [],
  },
  {
    slug: 'iso-55001',
    code: 'ISO 55001:2024',
    name: 'Asset Management System',
    family: 'Quality & Operations',
    outcome: 'certification',
    launch: true,
    summary: 'Get the most value from physical assets across their life: strategy, risk-based maintenance and investment decisions.',
    whoNeedsIt: ['Utilities, transport, ports and infrastructure operators', 'Facilities management and real-estate portfolios'],
    regionalDrivers: { uae: 'Widely referenced by utilities and infrastructure owners.', ksa: 'Relevant to utilities, transport and giga-project asset owners.' },
    courses: ['ISO 55001 Lead Auditor'],
    faqs: [],
  },
  {
    slug: 'iso-31000',
    code: 'ISO 31000:2018',
    name: 'Risk Management',
    family: 'Risk, Security & Continuity',
    outcome: 'guidance',
    launch: true,
    summary: 'Principles and a process for enterprise risk management that fits any organisation. It is guidance, so it is adopted rather than certified.',
    whoNeedsIt: ['Boards and risk committees setting up ERM', 'Organisations aligning departmental risk registers into one view'],
    regionalDrivers: { uae: 'A common reference for ERM frameworks in government and financial services.', ksa: 'A common reference for ERM frameworks in government and financial services.' },
    courses: ['Risk Management Professional Training', 'ISO 31000 Internal Auditor'],
    faqs: [],
  },
  {
    slug: 'iso-20000-1',
    code: 'ISO/IEC 20000-1:2018',
    name: 'IT Service Management (ITSM)',
    family: 'AI & Technology',
    outcome: 'certification',
    launch: true,
    summary: 'A management system for planning, delivering and improving IT services — commonly paired with ISO 27001.',
    whoNeedsIt: ['Managed service providers and internal IT departments', 'Shared-service centres with SLAs'],
    regionalDrivers: { uae: 'Requested by public and enterprise buyers of managed IT services.', ksa: 'Requested by public and enterprise buyers of managed IT services.' },
    courses: ['ISO 20000-1 Lead Auditor'],
    faqs: [],
  },
];

export const launchedStandards = standards.filter((s) => s.launch);

export const outcomeLabel: Record<Outcome, string> = {
  certification: 'Certifiable by an accredited certification body',
  accreditation: 'Leads to accreditation by a national accreditation body',
  guidance: 'Guidance standard — implemented, not certified',
};
