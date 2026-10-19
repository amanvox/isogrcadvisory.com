-- Lead register. One row per enquiry; step 1 creates it (partial), step 2 completes it.
CREATE TABLE IF NOT EXISTS leads (
  lead_id      TEXT PRIMARY KEY,
  stage        TEXT NOT NULL,            -- partial | complete
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  tier         TEXT,                     -- priority | nurture | self-serve
  score_total  INTEGER,
  route        TEXT,
  name         TEXT,
  email        TEXT,
  phone        TEXT,
  country      TEXT,
  company      TEXT,
  page         TEXT,
  utm_source   TEXT,
  utm_campaign TEXT,
  notified_at  TEXT,                     -- when the alert email went out
  status       TEXT NOT NULL DEFAULT 'New', -- pipeline: New, Qualifying, Sent to partner, Won, Lost, Spam
  notes        TEXT,
  data         TEXT NOT NULL             -- full submitted payload as JSON
);
CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_pending ON leads (stage, notified_at);
