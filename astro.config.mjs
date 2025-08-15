import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import path from 'path';


export default defineConfig({
  site: 'https://gorakudo.org',
  base: '/',
  // Penting untuk GitHub Pages
  output: 'static',
  integrations: [vue()],
  vite:{
    resolve: {
      alias: {
        '@' : path.resolve('./src')
      }
    }
  },
});