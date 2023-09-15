import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"

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
			social: {
				github: "https://github.com/lukeshay/astro-aws",
			},
			tagline: "AWS CDK constructs for Astro",
			title: "Astro AWS",
		}),
	],
	output: "static",
	site: `https://astro-aws.org/`,
})
