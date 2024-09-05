import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import d2 from "astro-d2";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import icon from "astro-icon";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://sakakibara-yuuki.github.io',
  output: 'static',
  integrations: [mdx(), sitemap(), d2(), icon(), preact()],
  markdown: {
    remarkPlugins: [ remarkMath, [remarkToc, { heading: "Contents" }] ],
    rehypePlugins: [ rehypeKatex ],
  }
});