import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Toggle this when DNS for the custom domain is configured.
// While serving from spirit-of-the-front-range.github.io/spirit-website/
// we need a base path so asset URLs resolve. When the custom domain
// (spiritofthefrontrange.org) is live, set USE_CUSTOM_DOMAIN=true.
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === 'true';

export default defineConfig({
  site: useCustomDomain
    ? 'https://spiritofthefrontrange.org'
    : 'https://spirit-of-the-front-range.github.io',
  base: useCustomDomain ? '/' : '/spirit-website/',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    responsiveStyles: true,
  },
});
