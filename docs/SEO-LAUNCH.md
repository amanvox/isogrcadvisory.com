# SEO launch checklist

Built into the site (no action needed):
- `sitemap-index.xml` → `sitemap-0.xml`: every indexable page with `lastmod` from the build. Enquire, thank-you and 404 are excluded.
- `robots.txt` generated from `site.url`: allows everything except `/thank-you/` and `/enquire/`, and points to the sitemap.
- Every page: unique title (≤70 chars) and meta description (≤160), one H1, canonical URL on `https://isogrcadvisory.com`, robots meta, Open Graph and Twitter card tags with `/brand/og.png`, favicon, apple-touch icon and web manifest.
- Structured data: ProfessionalService on every page, WebSite on the home page, BreadcrumbList on every inner page, FAQPage on pages with FAQs.
- Visible breadcrumbs on every inner page.
- `public/_headers`: long cache for hashed assets, basic security headers.
- `npm run build && npm run seo:audit` re-checks all of the above and regenerates `docs/URL-INVENTORY.md`.

To do at launch (owner):
1. Custom domains for `isogrcadvisory.com` and `www.isogrcadvisory.com` are set in `wrangler.jsonc`. Create a Cloudflare Redirect Rule: `www` → `https://isogrcadvisory.com` (301, keep path and query).
2. Google Search Console: add a Domain property for `isogrcadvisory.com` (DNS TXT record in Cloudflare), then submit `https://isogrcadvisory.com/sitemap-index.xml`.
3. Bing Webmaster Tools: import from Search Console.
4. Set `analytics.ga4Id` in `src/data/site.ts` (loads only after cookie consent).
5. Google Business Profile only if you have a real, publishable business address.
6. Don't let the temporary `workers.dev` preview become the indexed site: canonicals already point to the real domain.
