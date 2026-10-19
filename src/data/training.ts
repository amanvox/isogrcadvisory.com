// Training catalogue (what can be requested) and cohorts (dated public sessions).
// Catalogue items never show dates or fees — visitors request them.
// Cohorts only render when `confirmed: true` AND the start date is in the future.
// Awarding/accrediting body text is shown only when `credential` is filled in.

export interface Course {
  title: string;
  level?: 'Foundation' | 'Internal Auditor' | 'Lead Auditor' | 'Implementer' | 'Professional' | 'Workshop';
  days?: number;
  credential?: string; // TODO per course: confirmed awarding/accrediting body, or leave undefined
}

export interface Category {
  id: string;
  name: string;
  blurb: string;
  route: 'iso-training' | 'other-training';
  courses: Course[];
}

export const categories: Category[] = [
  {
    id: 'iso-auditor',
    name: 'ISO Auditor & Implementer',
    blurb: 'Foundation, internal auditor and lead auditor courses for the most widely used management system standards.',
    route: 'iso-training',
    courses: [
      { title: 'ISO 9001 QMS Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 9001 QMS Internal Auditor', level: 'Internal Auditor', days: 2 },
      { title: 'ISO/IEC 27001 ISMS Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO/IEC 27001 ISMS Internal Auditor', level: 'Internal Auditor' },
      { title: 'ISO 22301 BCMS Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO/IEC 42001 AI Management System Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 14001 EMS Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 45001 OH&S Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 22000 FSMS Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO/IEC 17025 Laboratory Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 21001 EOMS Lead Auditor', level: 'Lead Auditor' },
      { title: 'ISO 55001 Asset Management Lead Auditor', level: 'Lead Auditor', days: 5 },
      { title: 'ISO 37001 Anti-Bribery Lead Auditor', level: 'Lead Auditor' },
      { title: 'ISO/IEC 20000-1 ITSM Lead Auditor', level: 'Lead Auditor' },
      { title: 'ISO 37301 Compliance Management Lead Implementer', level: 'Implementer' },
      { title: 'Integrated Management System (IMS) Internal Auditor', level: 'Internal Auditor' },
    ],
  },
  {
    id: 'grc-bcm',
    name: 'Governance, Risk & Continuity',
    blurb: 'Risk management, business impact analysis and disaster recovery for risk, audit and resilience teams.',
    route: 'other-training',
    courses: [
      { title: 'Risk Management Professional (ISO 31000)', level: 'Professional', days: 2 },
      { title: 'Certified Business Impact Analysis Professional', level: 'Professional', days: 2 },
      { title: 'Advanced Business Continuity & Disaster Recovery', level: 'Professional' },
      { title: 'Balanced Scorecard Implementation', level: 'Professional', days: 2 },
    ],
  },
  {
    id: 'ai-data',
    name: 'AI, Data & Digital',
    blurb: 'Practical AI and data skills for leaders and functions, plus internationally recognised AI certification tracks.',
    route: 'other-training',
    courses: [
      { title: 'AI for Business Leaders', level: 'Workshop', days: 2 },
      { title: 'Generative AI Essentials for Business Professionals', level: 'Workshop', days: 2 },
      { title: 'AI for HR / Finance / Marketing / L&D', level: 'Workshop', days: 2 },
      { title: 'AI Assistants for Office Productivity', level: 'Workshop' },
      { title: 'Prompt Engineering Masterclass', level: 'Workshop' },
      { title: 'Power BI: Data Visualisation & Dashboards', level: 'Workshop', days: 2 },
      { title: 'Advanced MS Excel', level: 'Workshop', days: 2 },
      { title: 'AI certification tracks (Foundation, Executive, role-based, technical)', level: 'Professional' },
    ],
  },
  {
    id: 'process',
    name: 'Process Excellence & Projects',
    blurb: 'Lean, Six Sigma, project management and innovation methods that improve how work gets done.',
    route: 'other-training',
    courses: [
      { title: 'Lean Six Sigma Yellow Belt', level: 'Professional' },
      { title: 'Lean Six Sigma Green Belt', level: 'Professional' },
      { title: 'Lean Six Sigma Black Belt', level: 'Professional' },
      { title: 'PMP® Exam Preparation', level: 'Professional', days: 5 },
      { title: 'Agile & Scrum Fundamentals', level: 'Workshop', days: 1 },
      { title: 'Certified Design Thinking Professional', level: 'Professional', days: 5 },
      { title: 'Certified Innovation Professional', level: 'Professional', days: 2 },
      { title: 'Kaizen & Continuous Improvement', level: 'Workshop', days: 2 },
    ],
  },
  {
    id: 'hse-esg',
    name: 'HSE & Sustainability',
    blurb: 'Safety leadership, hazard identification and ESG capability.',
    route: 'other-training',
    courses: [
      { title: 'Hazard Identification & Risk Assessment (HIRA)', level: 'Workshop', days: 1 },
      { title: 'HSE Leadership & Risk Management', level: 'Workshop', days: 2 },
      { title: 'Certified ESG Professional', level: 'Professional', days: 3 },
      { title: 'Carbon Footprint Measurement & Reduction', level: 'Workshop', days: 2 },
      { title: 'Sustainability & Green Business Practices', level: 'Workshop', days: 2 },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership & Professional Skills',
    blurb: 'Leadership, negotiation, communication and finance skills for managers and teams.',
    route: 'other-training',
    courses: [
      { title: 'Executive Leadership & Strategic Thinking', level: 'Workshop', days: 2 },
      { title: 'Transformational Leadership', level: 'Workshop', days: 2 },
      { title: 'Emotional Intelligence for Managers', level: 'Workshop', days: 2 },
      { title: 'Negotiation & Handling Objections', level: 'Workshop', days: 2 },
      { title: 'Customer Service & Complaint Management', level: 'Workshop', days: 2 },
      { title: 'Public Speaking & Presentation Skills', level: 'Workshop', days: 2 },
      { title: 'Finance for Non-Finance Managers', level: 'Workshop', days: 2 },
      { title: 'Train the Trainer', level: 'Workshop', days: 2 },
    ],
  },
];

export interface Cohort {
  course: string;
  start: string; // YYYY-MM-DD
  end: string;
  location: string; // e.g. 'Riyadh', 'Dubai', 'Virtual'
  confirmed: boolean; // only true once the delivery partner confirms date, venue and seats
}

// Seeded from the partner's public 2026 calendar (all listed in Doha). Kept unconfirmed so
// nothing renders until UAE/KSA/virtual dates are confirmed — flip `confirmed` per row.
export const cohorts: Cohort[] = [
  { course: 'ISO 22301 BCMS Lead Auditor', start: '2026-12-20', end: '2026-12-24', location: 'TBC', confirmed: false },
  { course: 'Lean Six Sigma Yellow Belt + Green Belt', start: '2026-11-22', end: '2026-11-26', location: 'TBC', confirmed: false },
  { course: 'PMP® Exam Preparation', start: '2026-12-27', end: '2026-12-31', location: 'TBC', confirmed: false },
  { course: 'Power BI: Data Visualisation & Dashboards', start: '2026-11-18', end: '2026-11-19', location: 'TBC', confirmed: false },
];

export function upcomingCohorts(today = new Date()) {
  const t = today.toISOString().slice(0, 10);
  return cohorts.filter((c) => c.confirmed && c.start >= t).sort((a, b) => a.start.localeCompare(b.start));
}
