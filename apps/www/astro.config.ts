import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import remarkToc from "remark-toc"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		logFnRequest: true,
		logFnResponse: true,
	}),
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkToc],
	},
	output: "server",
	site: `https://astro-aws.org/`,
})
