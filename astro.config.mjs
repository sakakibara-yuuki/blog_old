import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://sakakibara-yuuki.github.io',
    base: '/blog',
	integrations: [mdx(), sitemap()],
});
