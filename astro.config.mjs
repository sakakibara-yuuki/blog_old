import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import d2 from "astro-d2";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: 'https://sakakibara-yuuki.github.io',
  output: 'static',
  integrations: [mdx(), sitemap(), d2()],
  markdown: {
    remarkPlugins: [ [remarkToc, { heading: "Contents" }] ],
  }
});
