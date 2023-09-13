import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			customCss: ["./src/styles/base.css"],
			pagination: true,
			social: {
				github: "https://github.com/lukeshay/astro-aws",
			},
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
			title: "Astro AWS",
			tagline: "AWS CDK constructs for Astro",
		}),
	],
	output: "static",
	site: `https://astro-aws.org/`,
})
