// Post-build: hash every inline <script> in dist/ and write a strict Content-Security-Policy
// into dist/_headers, so the site needs no 'unsafe-inline' for scripts.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

const hashes = new Set();
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] || '';
    if (/\ssrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')} https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com https://cloudflareinsights.com",
  'frame-src https://challenges.cloudflare.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const path = join(dist, '_headers');
const headers = readFileSync(path, 'utf8');
if (!headers.includes('Content-Security-Policy: __CSP__')) throw new Error('_headers is missing the __CSP__ placeholder');
writeFileSync(path, headers.replace('Content-Security-Policy: __CSP__', `Content-Security-Policy: ${csp}`));
console.log(`csp: ${hashes.size} inline script hashes written to dist/_headers`);
