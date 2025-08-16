import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://gorakudo.org",
  base: "/",

  // Penting untuk GitHub Pages
  output: "static",

  integrations: [vue()],

  vite: {
    plugins: [tailwindcss()],
  },
});
