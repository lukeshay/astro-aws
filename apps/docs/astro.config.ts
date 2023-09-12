import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import aws from "@astro-aws/adapter"

const isSSR = process.env.SSR_BUILD === "true"

// https://astro.build/config
export default defineConfig({
	adapter: isSSR
		? aws({
				logFnRequest: true,
				logFnResponse: true,
		  })
		: undefined,
	integrations: [
		starlight({
			customCss: ["./src/styles/base.css"],
			title: "Astro AWS",
			tagline: "AWS CDK constructs for Astro",
			social: {
				github: "https://github.com/lukeshay/astro-aws",
			},
			sidebar: [
				{
					autogenerate: { 
						directory: "guides" },
					label: "Guides",
				},
				{
					autogenerate: { 
						directory: "reference" },
					label: "Reference",
				},
			],
		}),
	],
	outDir: isSSR ? "dist/server" : "dist/static",
	output: isSSR ? "server" : "static",
	site: `https://astro-aws.org/`,
})
