// GRC content: software buyer's guides, consulting services and regulation guides.
// No vendor performance statistics are used; add them only with substantiation and approval.

// GRC software is covered as a buyer's guide: what each category of software should do and how to
// choose one. ISO GRC Advisory does not build or sell software, and no vendor is named on the site.

export interface Module {
  slug: string;
  name: string; // software category
  short: string;
  problem: string;
  capabilities: string[]; // what to look for
  workflow: string[]; // process the software should support
  frameworks: string[];
  forWho: string[];
  connects: string[]; // what it should connect with
  questions: string[]; // questions to ask vendors
  faqs: { q: string; a: string }[];
}

export const selectionServices = [
  { t: 'Requirements', d: 'Turn your frameworks, processes, users and reporting needs into a written requirements list and scoring model.' },
  { t: 'Shortlist', d: 'Identify established global and regional platforms that fit your requirements, budget, hosting and language needs.' },
  { t: 'Scripted demos', d: 'Give every vendor the same scenarios from your own processes, and score them side by side instead of watching sales demos.' },
  { t: 'Proof of concept', d: 'Test the shortlisted platform with real data and real users before you sign.' },
  { t: 'Implementation support', d: 'Configure frameworks, workflows and roles, migrate data from spreadsheets, and plan a phased rollout.' },
  { t: 'Adoption', d: 'Train risk owners, auditors and auditees, and set the routines that keep the system in use after go-live.' },
];

export const platformCapabilities = [
  { t: 'One source of evidence', d: 'Risks, controls, audits, documents and actions in one system rather than spreadsheets, shared drives and email threads.' },
  { t: 'Live dashboards', d: 'Views by entity, department, standard or regulation, so leadership sees status without waiting for a monthly report.' },
  { t: 'Automated reporting', d: 'Committee, board and regulator reports generated from live data rather than rebuilt by hand.' },
  { t: 'Cross-framework mapping', d: 'One control linked to several standards and regulations, so the same evidence answers each of them.' },
  { t: 'Role-based access', d: 'Users see and change only what their role allows, with an audit trail of who did what and when.' },
  { t: 'Workflows and alerts', d: 'Approvals, reminders and escalations for reviews, findings, incidents and corrective actions.' },
  { t: 'Integrations', d: 'APIs or connectors for HR, ticketing, identity and other systems, so data isn’t keyed in twice.' },
  { t: 'Templates and content', d: 'Pre-built frameworks and templates that shorten set-up, and guidance for occasional users.' },
];

// Criteria that matter most for buyers in the UAE and Saudi Arabia.
export const regionalCriteria = ['Data hosting and residency options', 'Arabic and English interfaces and reports', 'Saudi and UAE frameworks available as content', 'Cloud and on-premises deployment choices', 'Local implementation and support hours', 'Integration with identity and HR systems'];

export const enterpriseSuite = {
  intro: 'Some organisations outgrow single-purpose tools and look for an integrated enterprise management system: one platform that connects organisation structure, people, strategy, processes, risk, compliance, audit, continuity and assets, so each part draws on the same data.',
  pillars: [
    { t: 'Organisation and people', d: 'An organisation chart with roles and business functions, linked to skills, training and competency.' },
    { t: 'Strategy and performance', d: 'Objectives cascaded into departmental and individual KPIs, with execution and performance tracked over time.' },
    { t: 'Governance and compliance', d: 'Obligations managed at strategic, functional, operational and project level, including those involving external stakeholders.' },
    { t: 'Risk and internal audit', d: 'Enterprise risk management alongside a risk-based internal audit function, sharing the same risk and control data.' },
    { t: 'Security and continuity', d: 'Information security, business continuity and disaster recovery managed next to the risks they address.' },
    { t: 'Knowledge library', d: 'Standards, frameworks and internal guidance that teams can refer to while they work.' },
  ],
  components: ['Organisation structure', 'People and competency', 'Strategy and KPIs', 'Business process management', 'Knowledge library', 'Compliance management', 'Risk management', 'Internal audit', 'External audit', 'Information security', 'Business continuity', 'Incident management', 'Nonconformity and CAPA', 'Customer feedback', 'Asset management', 'Health, safety & environment', 'Business assessments', 'Management review'],
};

export const modules: Module[] = [
  {
    slug: 'governance-risk-compliance',
    name: 'GRC software',
    short: 'Software that brings policies, obligations, risks, controls and evidence into one place.',
    problem: 'Obligations come from regulators, standards, contracts and internal policy, and each is tracked by a different team in a different file. Nobody can say with confidence which controls are working, or how far the organisation is from meeting a new requirement.',
    capabilities: ['Obligation and regulation register', 'Policy lifecycle with attestations', 'Integrated risk register with treatment plans', 'Control library mapped to several frameworks', 'Compliance scoring, including a gap view for requirements you plan to adopt', 'Control testing and evidence collection', 'Reporting by entity, department and framework'],
    workflow: ['Strategy', 'Policies', 'Risk identification', 'Risk assessment', 'Risk treatment', 'Controls and procedures', 'Internal and external audit', 'Reporting'],
    frameworks: ['ISO 37301', 'ISO 31000', 'NCA ECC', 'SAMA frameworks', 'UAE IA', 'PDPL'],
    forWho: ['Chief compliance and risk officers', 'Government entities with several regulators', 'Groups with multiple legal entities, departments or sites'],
    connects: ['Risk management', 'Internal audit', 'Document control', 'Identity and HR systems'],
    questions: ['Which Saudi and UAE frameworks are available as ready content, and who keeps them updated?', 'Can one control be mapped to several frameworks without duplicating evidence?', 'How are multiple legal entities and sites handled?'],
    faqs: [
      { q: 'What does GRC software replace?', a: 'Typically the spreadsheets, shared folders and email chains used to track obligations, risks, controls and audit findings. Those move into one system with owners, due dates and reports.' },
      { q: 'Do you sell GRC software?', a: 'No. We help you define requirements, compare established platforms and implement the one you choose.' },
    ],
  },
  {
    slug: 'enterprise-risk-management',
    name: 'Enterprise risk management software',
    short: 'A living risk and opportunity register linked to owners, treatments and key risk indicators.',
    problem: 'Risk registers are refreshed once a year for the committee and forgotten in between. Departmental registers use different scales, so the enterprise view is a manual consolidation exercise.',
    capabilities: ['Corporate and departmental risk and opportunity registers', 'Configurable likelihood-and-impact matrix', 'Heat maps by priority and severity', 'Inherent and residual risk', 'Key risk indicators with thresholds and alerts', 'Treatment plans with follow-ups and history', 'Links between incidents and the risks they relate to'],
    workflow: ['Set objectives and scope', 'Identify risks', 'Assess and forecast impact', 'Treat and assign owners', 'Monitor against criteria', 'Report to leadership'],
    frameworks: ['ISO 31000', 'COSO ERM', 'ISO 22301 (BIA links)'],
    forWho: ['Risk managers and CROs', 'Audit and risk committees', 'Strategy and performance offices'],
    connects: ['Strategy and KPIs', 'Incident management', 'Business continuity', 'Internal audit'],
    questions: ['Can we use our own risk scoring matrix and taxonomy?', 'Do departmental registers roll up automatically into the corporate view?', 'How are KRIs fed: manual entry, imports or integrations?'],
    faqs: [
      { q: 'How is ERM different from financial risk management?', a: 'ERM covers risks across every function, including operations, supply chain, people, reputation and technology, and connects them to strategy. Financial risk management is narrower and more quantitative.' },
    ],
  },
  {
    slug: 'internal-audit-management',
    name: 'Internal audit software',
    short: 'Audit universe, plan, fieldwork, findings and follow-up without the spreadsheets.',
    problem: 'Audit plans live in Excel, working papers in folders and findings in email. Following up management actions takes more time than the audit itself.',
    capabilities: ['Audit universe and auditable entities', 'Risk-based annual audit plan', 'Fieldwork, testing and working papers', 'Findings, ratings, draft reports and review', 'Root cause analysis', 'Auditee access to respond to findings', 'Corrective and preventive actions tracked to closure', 'Audit committee reporting'],
    workflow: ['Define the audit universe', 'Approve the annual plan', 'Fieldwork and testing', 'Findings and root cause', 'Report and management response', 'Follow-up to closure'],
    frameworks: ['IIA Global Internal Audit Standards', 'ISO 19011', 'ISO management system audits'],
    forWho: ['Chief audit executives', 'Internal audit teams', 'Quality and IMS auditors'],
    connects: ['Risk management', 'Compliance management', 'Nonconformity and CAPA'],
    questions: ['Can auditees respond to findings without a full licence?', 'Does it handle both risk-based internal audits and ISO management system audits?', 'How is the audit universe linked to the risk register?'],
    faqs: [
      { q: 'Is internal audit software only for large audit teams?', a: 'No. Smaller teams often gain the most, because follow-up of management actions is where most of their time goes.' },
    ],
  },
  {
    slug: 'cybersecurity-compliance',
    name: 'Cybersecurity compliance software',
    short: 'Cyber risk, assessments and control evidence against ISO 27001 and Saudi and UAE frameworks.',
    problem: 'Security teams answer the same control questions for ISO 27001, national frameworks, supplier cybersecurity standards and every large customer, each time from scratch.',
    capabilities: ['Control sets for ISO/IEC 27001 and national frameworks', 'Cyber risk register and heat map', 'Threat, asset and vulnerability assessments', 'Statement of Applicability management', 'Incident tracking and awareness records', 'Evidence reuse across assessments and certifications'],
    workflow: ['Risk management set-up', 'Secure configuration', 'Network security', 'Access and permissions', 'Awareness and training', 'Incident management', 'Malware protection', 'Active monitoring'],
    frameworks: ['ISO/IEC 27001', 'NCA ECC', 'NCA CCC', 'SACS-002', 'SAMA CSF', 'UAE IA'],
    forWho: ['CISOs and security GRC teams', 'Suppliers to energy-sector and government buyers', 'IT departments in regulated sectors'],
    connects: ['Asset inventory', 'Risk management', 'Incident management', 'Internal audit'],
    questions: ['Are NCA ECC, SAMA CSF, UAE IA and SACS-002 control sets included, and how quickly are new editions added?', 'Can evidence be reused across frameworks?', 'Where will our security data be hosted?'],
    faqs: [
      { q: 'Can one control set cover ISO 27001, NCA ECC and supplier standards such as SACS-002?', a: 'Largely, yes, if the software supports cross-framework mapping. One piece of evidence can then support several assessments, with each framework’s specific requirements added on top.' },
    ],
  },
  {
    slug: 'quality-management-software',
    name: 'Quality management software',
    short: 'Processes, objectives, nonconformities, corrective actions and training for ISO 9001 and integrated systems.',
    problem: 'Nonconformities and corrective actions are logged inconsistently and rarely closed on time, which is exactly what certification auditors look for.',
    capabilities: ['Process maps and quality policy', 'Quality objectives with KPIs', 'Nonconformity and corrective action workflow', 'Customer complaints and feedback', 'Training records and competency', 'Supplier evaluation', 'Management review inputs from live data'],
    workflow: ['Map processes', 'Set quality policy', 'Set objectives', 'Define KPIs', 'Run and monitor processes', 'Correct and improve'],
    frameworks: ['ISO 9001', 'ISO 22000', 'ISO/IEC 17025', 'Integrated management systems'],
    forWho: ['Quality and IMS managers', 'Manufacturers, labs and food businesses', 'Organisations maintaining several ISO certificates'],
    connects: ['Document control', 'Internal audit', 'Training and HR records', 'Customer feedback'],
    questions: ['Can it run several standards as one integrated management system?', 'How are corrective actions escalated when overdue?', 'Can management review packs be generated automatically?'],
    faqs: [
      { q: 'Do we need software to get ISO 9001 certified?', a: 'No. Many organisations certify with well-controlled documents and spreadsheets. Software becomes worthwhile when the volume of nonconformities, audits and records makes manual tracking unreliable.' },
    ],
  },
  {
    slug: 'hse-esg-management',
    name: 'HSE & ESG software',
    short: 'Hazards, incidents, emergencies, environmental impact, waste and ESG metrics.',
    problem: 'Safety incidents, environmental data and ESG metrics are collected by different people in different formats, so reporting is slow and hard to trust.',
    capabilities: ['Hazard identification and risk assessment', 'Environmental impact assessment', 'Incident and near-miss reporting with investigation', 'Emergency preparedness and response', 'Waste management, including hazardous waste', 'Inspection checklists, including on mobile', 'ESG metric collection and approval'],
    workflow: ['Identify hazards', 'Assess risks', 'Inspect and monitor', 'Report incidents', 'Investigate and correct', 'Review and improve'],
    frameworks: ['ISO 45001', 'ISO 14001', 'ESG reporting frameworks'],
    forWho: ['HSE managers', 'Sustainability and ESG teams', 'Contractors and industrial operators'],
    connects: ['Risk management', 'Incident management', 'Asset management'],
    questions: ['Can site staff and contractors report from mobile devices, including offline?', 'Which ESG reporting frameworks are supported?', 'Is Arabic available for frontline users?'],
    faqs: [
      { q: 'Should HSE and ESG be in the same system?', a: 'Often, yes. Much ESG data, such as incidents, emissions and waste, starts in HSE processes, so collecting it once avoids reconciliation later.' },
    ],
  },
  {
    slug: 'business-continuity-software',
    name: 'Business continuity software',
    short: 'Business impact analysis, continuity plans, crisis alerts and exercises kept current.',
    problem: 'Continuity plans are written for the audit and are out of date by the next one. Contact lists, dependencies and recovery times drift without anyone noticing.',
    capabilities: ['Business impact analysis', 'Recovery strategies and continuity plans', 'Dependency and supplier mapping', 'Mass notification during a crisis', 'Emergency and incident management', 'Exercise scheduling and results', 'Plan review reminders'],
    workflow: ['Business impact analysis', 'Recovery strategies', 'Continuity plans', 'Exercise and test', 'Respond to incidents', 'Review and update'],
    frameworks: ['ISO 22301', 'NCEMA 7000', 'SAMA business continuity requirements'],
    forWho: ['BCM managers', 'Banks, utilities and telecoms', 'Government entities'],
    connects: ['Risk management', 'Incident management', 'Asset inventory', 'HR directory'],
    questions: ['Do plans stay accessible if our main systems are down?', 'How are contact lists kept in sync with HR?', 'Can it produce evidence for NCEMA 7000 or ISO 22301 audits?'],
    faqs: [
      { q: 'Isn’t a shared folder of plans enough?', a: 'For a small organisation it can be. Software helps when plans, dependencies and contacts change often, and you need evidence that plans are reviewed and exercised.' },
    ],
  },
  {
    slug: 'document-management',
    name: 'Document control software',
    short: 'Controlled documents with versioning, approvals, retention and an audit trail.',
    problem: 'Staff work from outdated procedures because nobody is sure which version is current, and approvals wait in someone’s inbox.',
    capabilities: ['Version control with change notifications', 'Approval workflows, so changes go live only once approved', 'Permissions by role and confidentiality', 'Read-and-acknowledge tracking', 'Search and indexing', 'Retention rules and removal of obsolete documents', 'An audit trail of views and changes'],
    workflow: ['Review the current document flow', 'Define needs and access rules', 'Configure approvals and security', 'Migrate documents', 'Train users', 'Maintain and review'],
    frameworks: ['ISO 9001 documented information', 'ISO/IEC 27001', 'All ISO management systems'],
    forWho: ['Quality and compliance teams', 'Any organisation with ISO certificates'],
    connects: ['Quality management', 'Training records', 'Existing file storage'],
    questions: ['Does it work alongside our existing file storage, or replace it?', 'Can staff acknowledge they have read a new procedure?', 'How is a document’s full history shown to an auditor?'],
    faqs: [
      { q: 'How does document control help in a certification audit?', a: 'Auditors look for current, approved, controlled documents and evidence that people use them. Version history, approvals and read-and-acknowledge records provide that evidence directly.' },
    ],
  },
  {
    slug: 'excellence-awards-assessment',
    name: 'Business excellence assessment software',
    short: 'Framework-based self-assessments with custom scoring for excellence models and awards.',
    problem: 'Preparing an excellence award submission means chasing evidence across the organisation for months, then starting again for the next cycle.',
    capabilities: ['Load the excellence frameworks you assess against', 'Custom scoring per framework', 'Assessments by document, system or department', 'Evidence collection by criterion', 'Improvement actions and cycle-to-cycle comparison', 'Assessor-ready reports'],
    workflow: ['Select frameworks', 'Set scoring', 'Assess by department or system', 'Collect evidence', 'Plan improvements', 'Report and compare cycles'],
    frameworks: ['EFQM Model', 'UAE government excellence programmes', 'Saudi quality and excellence awards'],
    forWho: ['Strategy and excellence offices', 'Government entities in excellence programmes', 'Organisations applying for quality awards'],
    connects: ['Strategy and KPIs', 'Document control', 'Business processes'],
    questions: ['Can we load our own excellence model and scoring?', 'Is evidence kept between cycles?', 'Can assessors be given read-only access?'],
    faqs: [
      { q: 'Is specialist software needed for an excellence award?', a: 'Not always. It pays off when several departments contribute evidence and you go through repeated assessment cycles.' },
    ],
  },
];

export interface Service {
  t: string;
  d: string;
  points: string[];
}

export const grcServices: Service[] = [
  { t: 'GRC framework design', d: 'Define how governance, risk and compliance fit together: roles, committees, policies, the obligation register and reporting lines.', points: ['Three-lines model', 'Policy architecture', 'Committee charters and reporting'] },
  { t: 'Enterprise risk management', d: 'Build or refresh an ERM framework aligned with ISO 31000: risk appetite, taxonomy, scoring, KRIs and the reporting cycle.', points: ['Risk appetite statement', 'Risk workshops by function', 'KRI design'] },
  { t: 'Regulatory compliance mapping', d: 'Map national frameworks and standards to one control set so you assess once and report many times.', points: ['NCA ECC, SACS-002, SAMA, UAE IA', 'ISO 27001 and 22301 alignment', 'Gap register and roadmap'] },
  { t: 'Internal audit capability', d: 'Strengthen the internal audit function: methodology, risk-based planning, competency benchmarking and auditor training.', points: ['Audit methodology and templates', 'Competency framework for auditors', 'IIA-aligned quality assessment preparation'] },
  { t: 'Business continuity programme', d: 'Stand up or mature a continuity programme: BIA, strategies, plans and exercises aligned with ISO 22301 and national standards.', points: ['BIA facilitation', 'Plan writing and exercises', 'NCEMA 7000 / ISO 22301 alignment'] },
  { t: 'GRC software selection', d: 'Define requirements, shortlist established platforms, run scripted demos and support implementation, so the software fits your framework rather than the other way round.', points: ['Requirements and scoring model', 'Scripted demos and proof of concept', 'Rollout and adoption'] },
  { t: 'Compliance management system', d: 'Implement a compliance management system so obligations are identified, owned, monitored and reported.', points: ['ISO 37301 implementation', 'Anti-bribery controls (ISO 37001)', 'Compliance training'] },
];

export interface Regulation {
  slug: string;
  name: string;
  short: string;
  country: 'Saudi Arabia' | 'UAE';
  issuer: string;
  appliesTo: string;
  summary: string[];
  steps?: { t: string; d: string }[];
  howWeHelp: string[];
  relatedStandards: string[]; // standard slugs in standards.ts
  relatedModules: string[]; // module slugs
  faqs: { q: string; a: string }[];
}

const legal = { q: 'Is this legal advice?', a: 'No. This is a general overview. Confirm scope, the current edition and your obligations with the issuing authority and your legal or compliance advisers.' };

// TODO before launch: have a GRC/legal reviewer check every summary below against the current editions.
export const regulations: Regulation[] = [
  {
    slug: 'nca-ecc',
    name: 'NCA Essential Cybersecurity Controls (ECC)',
    short: 'NCA ECC',
    country: 'Saudi Arabia',
    issuer: 'National Cybersecurity Authority (NCA)',
    appliesTo: 'Government organisations in Saudi Arabia, their companies and entities, and private-sector organisations that own, operate or host critical national infrastructure.',
    summary: [
      'The ECC are the baseline cybersecurity controls issued by Saudi Arabia’s National Cybersecurity Authority. They are organised into main domains covering cybersecurity governance, defence, resilience, third-party and cloud security, and industrial control systems.',
      'Organisations in scope implement the controls, assess compliance and report to the NCA. Other NCA control sets, for cloud, critical systems, data and operational technology, build on the ECC.',
    ],
    howWeHelp: ['Gap assessment against the current ECC edition', 'Combined control set with ISO/IEC 27001 to avoid duplicate work', 'Policy and procedure development', 'Evidence tracking and self-assessment in GRC software', 'Awareness and technical training for staff'],
    relatedStandards: ['iso-27001', 'iso-22301'],
    relatedModules: ['cybersecurity-compliance', 'governance-risk-compliance'],
    faqs: [
      { q: 'Does ISO 27001 certification mean we comply with NCA ECC?', a: 'No. They overlap substantially, but the ECC contains specific requirements of its own. A combined control set lets one programme produce evidence for both.' },
      legal,
    ],
  },
  {
    slug: 'aramco-ccc',
    name: 'Aramco Cybersecurity Compliance Certificate (CCC)',
    short: 'Aramco CCC',
    country: 'Saudi Arabia',
    issuer: 'Saudi Aramco (Third Party Cybersecurity Standard, SACS-002)',
    appliesTo: 'Suppliers, contractors and service providers that work with Saudi Aramco, particularly those that connect to its network, handle its data, host or develop systems for it, or provide cloud or outsourced services.',
    summary: [
      'Aramco requires third parties to meet its Third Party Cybersecurity Standard (SACS-002). The controls that apply depend on the type of service you provide and how it touches Aramco’s systems and data. Each type is a class with its own control set.',
      'Compliance is demonstrated through an assessment by an Aramco-approved audit firm, which leads to a Cybersecurity Compliance Certificate (CCC). The certificate is commonly needed to bid, to be awarded work or to renew a contract, so plan for it early in a tender.',
    ],
    steps: [
      { t: 'Confirm your class', d: 'Work out which SACS-002 classes apply from the services in your contract or tender.' },
      { t: 'Gap assessment', d: 'Compare current controls, policies and evidence with the applicable SACS-002 requirements.' },
      { t: 'Remediate', d: 'Close gaps in policies, technical controls, awareness and documentation, and prepare the evidence.' },
      { t: 'Assessment', d: 'An Aramco-approved audit firm assesses your compliance.' },
      { t: 'Certificate and upkeep', d: 'Maintain controls and evidence so renewal is routine, not a new project.' },
    ],
    howWeHelp: ['Class identification from your services and contracts', 'SACS-002 gap assessment and remediation plan', 'Policies, procedures and evidence packs', 'Mapping to ISO/IEC 27001 and NCA ECC to reuse work', 'Evidence tracking in GRC software', 'Staff cybersecurity awareness'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['cybersecurity-compliance', 'document-management'],
    faqs: [
      { q: 'Is Aramco’s CCC the same as NCA’s CCC?', a: 'No. Aramco’s CCC is the Cybersecurity Compliance Certificate for its third parties under SACS-002. NCA’s CCC is the Cloud Cybersecurity Controls, a national control set for cloud providers and cloud users.' },
      { q: 'Who carries out the assessment?', a: 'An audit firm approved by Aramco. Preparation and remediation are separate from the assessment, which keeps it independent.' },
      { q: 'Does ISO 27001 replace the CCC?', a: 'No, but an ISO 27001 programme covers much of the same ground, so evidence can often be reused for the SACS-002 assessment.' },
      legal,
    ],
  },
  {
    slug: 'saudi-pdpl',
    name: 'Saudi Personal Data Protection Law (PDPL)',
    short: 'Saudi PDPL',
    country: 'Saudi Arabia',
    issuer: 'Saudi Data & AI Authority (SDAIA)',
    appliesTo: 'Organisations that process personal data of individuals in Saudi Arabia, including organisations outside the Kingdom that process such data.',
    summary: [
      'The PDPL sets the rules for collecting, using, disclosing and transferring personal data in Saudi Arabia, and SDAIA supervises it. It is in force and enforced, with implementing regulations and separate rules for transferring personal data outside the Kingdom.',
      'Key themes include a lawful basis for processing, privacy notices, data subject rights (to be informed, to access, to correct and to have data destroyed), records of processing, security measures, breach notification to the regulator within set timeframes, and conditions for cross-border transfers. Some controllers must also register and appoint a data protection officer.',
    ],
    steps: [
      { t: 'Map your data', d: 'Inventory the personal data you hold, why, where it is stored and who it is shared with.' },
      { t: 'Assess gaps', d: 'Compare notices, consents, retention, security and transfer practices with the PDPL and its regulations.' },
      { t: 'Fix and document', d: 'Update notices, consent flows, contracts with processors, retention schedules and records of processing.' },
      { t: 'Operate', d: 'Handle data subject requests, breaches and transfer assessments through defined workflows.' },
    ],
    howWeHelp: ['Data inventory and records of processing', 'PDPL gap assessment', 'Privacy notices, consent and processor contracts', 'Breach and data subject request workflows', 'Cross-border transfer assessment support', 'Privacy controls tracked alongside security controls'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['governance-risk-compliance', 'cybersecurity-compliance', 'document-management'],
    faqs: [
      { q: 'Does the PDPL apply to companies outside Saudi Arabia?', a: 'It can. The law covers processing of personal data of individuals in Saudi Arabia, including by organisations based elsewhere.' },
      legal,
    ],
  },
  {
    slug: 'nca-cloud-cybersecurity-controls',
    name: 'NCA Cloud Cybersecurity Controls (CCC)',
    short: 'NCA CCC',
    country: 'Saudi Arabia',
    issuer: 'National Cybersecurity Authority (NCA)',
    appliesTo: 'Cloud service providers serving organisations in Saudi Arabia, and organisations in scope of the ECC that use cloud services.',
    summary: [
      'The Cloud Cybersecurity Controls extend the ECC with requirements specific to cloud computing. They set separate obligations for cloud service providers and for the organisations that use their services.',
      'Topics include cloud security governance, data and hosting location, identity and access, encryption, logging and monitoring, and the shared responsibilities between provider and customer.',
    ],
    howWeHelp: ['Applicability review for providers and cloud customers', 'Gap assessment against the CCC alongside the ECC', 'Shared-responsibility mapping with your cloud providers', 'Policies and evidence tracking'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['cybersecurity-compliance'],
    faqs: [legal],
  },
  {
    slug: 'nca-critical-systems-controls',
    name: 'NCA Critical Systems Cybersecurity Controls (CSCC)',
    short: 'NCA CSCC',
    country: 'Saudi Arabia',
    issuer: 'National Cybersecurity Authority (NCA)',
    appliesTo: 'Organisations in scope of the ECC that own or operate systems classified as critical.',
    summary: [
      'The CSCC add stricter controls on top of the ECC for critical systems, those whose disruption would seriously affect national security, the economy or essential services.',
      'They raise expectations in areas such as monitoring, vulnerability management, access control, backup and recovery for those systems.',
    ],
    howWeHelp: ['Identifying and scoping critical systems', 'Gap assessment against CSCC and ECC together', 'Remediation roadmap and evidence tracking'],
    relatedStandards: ['iso-27001', 'iso-22301'],
    relatedModules: ['cybersecurity-compliance', 'business-continuity-software'],
    faqs: [legal],
  },
  {
    slug: 'nca-data-cybersecurity-controls',
    name: 'NCA Data Cybersecurity Controls (DCC)',
    short: 'NCA DCC',
    country: 'Saudi Arabia',
    issuer: 'National Cybersecurity Authority (NCA)',
    appliesTo: 'Organisations in scope of the ECC that handle classified data.',
    summary: [
      'The DCC set cybersecurity controls for protecting data according to its classification level, across its lifecycle from creation to disposal.',
      'They connect closely with national data classification and data management standards, so data governance and cybersecurity teams need to work from the same inventory.',
    ],
    howWeHelp: ['Data classification and inventory support', 'Gap assessment against DCC requirements', 'Controls and evidence mapped to ECC and ISO 27001'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['cybersecurity-compliance', 'document-management'],
    faqs: [legal],
  },
  {
    slug: 'nca-ot-cybersecurity-controls',
    name: 'NCA Operational Technology Cybersecurity Controls (OTCC)',
    short: 'NCA OTCC',
    country: 'Saudi Arabia',
    issuer: 'National Cybersecurity Authority (NCA)',
    appliesTo: 'Organisations that operate industrial control systems and operational technology, such as energy, utilities, manufacturing and transport.',
    summary: [
      'The OTCC extend the ECC to operational technology and industrial control systems, where availability and safety matter as much as confidentiality.',
      'They cover OT asset inventory, network segmentation, remote access, monitoring, incident response and the coordination of IT and OT security.',
    ],
    howWeHelp: ['OT asset and risk assessment', 'Gap assessment against OTCC and ECC', 'Joint IT and OT security governance', 'Evidence tracking in GRC software'],
    relatedStandards: ['iso-27001', 'iso-45001'],
    relatedModules: ['cybersecurity-compliance', 'hse-esg-management'],
    faqs: [legal],
  },
  {
    slug: 'ndmo-data-management-standards',
    name: 'NDMO Data Management & Personal Data Protection Standards',
    short: 'NDMO standards',
    country: 'Saudi Arabia',
    issuer: 'National Data Management Office (NDMO), part of SDAIA',
    appliesTo: 'Government entities in Saudi Arabia, and organisations that handle government data on their behalf.',
    summary: [
      'The NDMO standards define how government entities govern and manage data. They span domains such as data governance, data quality, data classification, metadata, data sharing, open data, freedom of information and personal data protection.',
      'Entities are expected to set up data management roles and policies, measure their compliance, and report progress.',
    ],
    howWeHelp: ['Data governance roles and policies', 'Compliance assessment against the NDMO domains', 'Data classification and inventory', 'Alignment with PDPL and NCA DCC'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['governance-risk-compliance', 'document-management'],
    faqs: [legal],
  },
  {
    slug: 'sama-cybersecurity-framework',
    name: 'SAMA Cyber Security Framework',
    short: 'SAMA CSF',
    country: 'Saudi Arabia',
    issuer: 'Saudi Central Bank (SAMA)',
    appliesTo: 'Banks, insurers, finance companies and other organisations regulated by SAMA.',
    summary: [
      'SAMA’s Cyber Security Framework sets out cybersecurity requirements for regulated financial institutions across leadership and governance, risk management and compliance, operations and technology, and third-party security.',
      'Institutions assess their maturity against the framework and are expected to reach and sustain the level SAMA requires. SAMA also issues related requirements, including for business continuity.',
    ],
    howWeHelp: ['Maturity assessment against the framework', 'Remediation roadmap prioritised by risk', 'Mapping to ISO/IEC 27001 and ISO 22301', 'Evidence and maturity tracking in GRC software', 'Board and committee reporting packs'],
    relatedStandards: ['iso-27001', 'iso-22301', 'iso-31000'],
    relatedModules: ['cybersecurity-compliance', 'business-continuity-software', 'enterprise-risk-management'],
    faqs: [legal],
  },
  {
    slug: 'uae-ia-standards',
    name: 'UAE Information Assurance Standards',
    short: 'UAE IA',
    country: 'UAE',
    issuer: 'UAE federal cybersecurity authorities',
    appliesTo: 'UAE government entities and organisations designated as critical information infrastructure, plus suppliers asked to demonstrate equivalent controls.',
    summary: [
      'The UAE Information Assurance (IA) Standards set management and technical security controls for government and critical-sector entities. They take a risk-based approach and prioritise controls by threat level.',
      'Emirate-level and sector requirements, for example Dubai’s information security regulations and health-sector standards, often apply alongside them.',
    ],
    howWeHelp: ['Applicability and gap assessment', 'Combined control set with ISO/IEC 27001', 'Risk assessment and treatment plans', 'Evidence tracking in GRC software', 'Training for control owners'],
    relatedStandards: ['iso-27001', 'iso-22301'],
    relatedModules: ['cybersecurity-compliance', 'governance-risk-compliance'],
    faqs: [legal],
  },
  {
    slug: 'ncema-7000',
    name: 'NCEMA 7000 Business Continuity Standard',
    short: 'NCEMA 7000',
    country: 'UAE',
    issuer: 'National Emergency Crisis and Disasters Management Authority (NCEMA)',
    appliesTo: 'UAE federal and local government entities and organisations in critical sectors, as directed by NCEMA.',
    summary: [
      'NCEMA 7000 is the UAE’s national business continuity management standard. It sets requirements for continuity governance, business impact analysis, strategies, plans, exercises and review.',
      'It aligns closely with ISO 22301, so organisations often build one programme that satisfies both, and certify to ISO 22301 where an international certificate is useful.',
    ],
    howWeHelp: ['Gap assessment against NCEMA 7000 and ISO 22301', 'BIA facilitation and recovery strategies', 'Plan development and exercising', 'Continuity records in GRC software', 'BCM Foundation and Lead Auditor training'],
    relatedStandards: ['iso-22301'],
    relatedModules: ['business-continuity-software'],
    faqs: [legal],
  },
  {
    slug: 'uae-pdpl',
    name: 'UAE Personal Data Protection Law (PDPL)',
    short: 'UAE PDPL',
    country: 'UAE',
    issuer: 'UAE federal government',
    appliesTo: 'Organisations processing personal data in the UAE, outside free zones such as DIFC and ADGM that have their own data protection laws, and subject to sector-specific rules for areas like health and banking.',
    summary: [
      'The UAE’s federal Personal Data Protection Law sets principles for lawful, fair and transparent processing, data subject rights, security, breach notification and cross-border transfers. Its implementing detail continues to develop.',
      'Organisations operating in more than one regime, for example onshore and in DIFC or ADGM, need a single privacy programme that maps to each set of rules.',
    ],
    howWeHelp: ['Applicability review across onshore and free-zone regimes', 'Data inventory and records of processing', 'Privacy notices, consent and processor contracts', 'Breach and data subject request workflows'],
    relatedStandards: ['iso-27001'],
    relatedModules: ['governance-risk-compliance', 'document-management'],
    faqs: [legal],
  },
];
