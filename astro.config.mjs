import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import d2 from "astro-d2";
import remarkToc from "remark-toc";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import icon from "astro-icon";
import react from "@astrojs/react";

// Register `hName`, `hProperties` types, used when turning markdown to HTML:
/// <reference types="mdast-util-to-hast" />
// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import {h} from 'hastscript'
import {visit} from 'unist-util-visit'

import svelte from '@astrojs/svelte';
import astroD2Integration from 'astro-d2';

// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
function myRemarkPlugin() {
  /**
   * @param {import('mdast').Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'note' && node.name !== 'math') return

        const data = node.data || (node.data = {})
        const tagName = node.type === 'textDirective' ? 'span' : 'div'

        data.hName = tagName
        data.hProperties = h(tagName, node.attributes || {}).properties
      }
    })
  }
}

// https://astro.build/config
export default defineConfig({
  // site: 'https://sakakibara-yuuki.github.io',
  site: 'https://sakakibara.xyz',
  output: 'static',
  integrations: [
    mdx(),
    sitemap(),
    d2({layout: 'elk'}),
    icon(),
    react(),
    svelte()],
  markdown: {
    remarkPlugins: [
      [remarkToc, { heading: "Contents" }],
       remarkDirective,
       myRemarkPlugin,
       remarkMath
    ],
    rehypePlugins: [ rehypeKatex ],
  }
});
