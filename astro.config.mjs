import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://gorakudo.org',
  base: '/',

  // Penting untuk GitHub Pages
  output: 'static',

  integrations: [vue()]
});