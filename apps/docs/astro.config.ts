import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import starlightLinksValidator from "starlight-links-validator"

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			customCss: ["./src/styles/base.css"],
			pagination: true,
			sidebar: [
				{
					autogenerate: {
						directory: "guides",
					},
					label: "Guides",
				},
				{
					autogenerate: {
						directory: "reference",
					},
					label: "Reference",
				},
			],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/lukeshay/astro-aws",
				},
			],
			head: [
				{
					tag: "script",
					attrs: {
						src: "/load-cwr.js",
					},
				},
			],
			editLink: {
				baseUrl:
					"https://github.com/lukeshay/astro-aws/edit/main/apps/docs/src/content/",
			},
			tagline: "AWS CDK constructs for Astro",
			title: "Astro AWS",
			plugins: [starlightLinksValidator()],
		}),
	],
	output: "static",
	site: "https://www.astro-aws.org/",
})
