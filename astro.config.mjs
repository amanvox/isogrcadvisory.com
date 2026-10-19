// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Keep in sync with site.url in src/data/site.ts.
const built = new Date().toISOString();

export default defineConfig({
  site: 'https://isogrcadvisory.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(thank-you|enquire|404)\/?$/.test(page),
      serialize: (item) => ({ ...item, lastmod: built }),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
