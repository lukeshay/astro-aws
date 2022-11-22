import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import aws from "@astro-aws/adapter";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		esm: true,
	}),
	integrations: [preact(), react(), tailwind(), mdx(), sitemap()],
	markdown: {
		extendDefaultPlugins: true,
		remarkPlugins: [remarkToc],
	},
	output: "server",
	site: `https://astro-aws.lshay.dev/`,
});
