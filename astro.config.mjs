import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import path from 'path';

export default defineConfig({
  site: 'https://gorakudo.org',
  base: '/',
  output: 'static',
  integrations: [vue()],
  vite:{
    resolve: {
      alias: {
        '@' : path.resolve('./src')
      }
    }
  },

  // Penting untuk GitHub Pages

});