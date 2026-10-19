-- Salted SHA-256 of the submitter's IP (never the raw IP), used only for per-IP rate limiting.
ALTER TABLE leads ADD COLUMN ip_hash TEXT;
CREATE INDEX IF NOT EXISTS leads_ip_recent ON leads (ip_hash, created_at);
