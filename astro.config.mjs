import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';
import { remarkYouTube } from './src/plugins/remark-youtube.mjs';

export default defineConfig({
  site: 'https://overfullstack.github.io',
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      themeCssSelector: (theme) => {
        if (theme.name === 'github-dark') return '.dark';
        return ':root:not(.dark)';
      },
      styleOverrides: {
        borderRadius: '0.5rem',
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkYouTube],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
