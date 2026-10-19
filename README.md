# isogrcadvisory.com

Website for **ISO GRC Advisory**: ISO advisory, GRC advisory and professional training for the UAE and Saudi Arabia. Enquiries are captured with a two-step form, scored, and written to a lead register.

## Stack
Astro (static) + Tailwind 4, served as Cloudflare Workers static assets. There is no server: leads go to a Google Apps Script web app that writes to a Google Sheet.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run seo:audit  # after a build: checks every page and rewrites docs/URL-INVENTORY.md
```

## Where to edit
| What | File |
|---|---|
| Brand, contact, disclosure, lead endpoint, GA4, navigation | `src/data/site.ts` (+ domain in `astro.config.mjs`) |
| ISO standard pages (set `launch: false` to hide one) | `src/data/standards.ts` |
| GRC services, regulation guides, software buyer's guides | `src/data/grc.ts` |
| Course catalogue and dated cohorts (`confirmed: true` to show) | `src/data/training.ts` |
| City pages | `src/data/locations.ts` |
| Form fields and steps | `src/components/LeadForm.astro` |
| Scoring model and attribution | `src/scripts/lead.ts` |

## Lead backend
1. Create a Google Sheet. Open Extensions → Apps Script and paste `integrations/google-apps-script.gs`. Set `NOTIFY_EMAIL` and the `PARTNERS` labels in your copy.
2. Run `setup()` once and approve the permissions.
3. Deploy → Web app, with *Execute as: Me* and *Access: Anyone*. Copy the `/exec` URL.
4. Paste the URL into `site.leadEndpoint`, then push.
5. Submit a test enquiry. You should see a partial row after step 1, the same row marked complete after step 2, and an alert email.

Until `leadEndpoint` is set, a submission opens WhatsApp with the enquiry prefilled.

## Deploy (Cloudflare Workers Builds)
`wrangler.jsonc` serves `dist/` as static assets and attaches `isogrcadvisory.com` and `www.isogrcadvisory.com` as custom domains. Unknown URLs fall through to `404.html`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

Every push to `main` rebuilds and deploys. SEO launch steps: `docs/SEO-LAUNCH.md`.
