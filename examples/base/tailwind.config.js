import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.astro",
		"./src/**/*.js",
		"./src/**/*.jsx",
		"./src/**/*.ts",
		"./src/**/*.tsx",
		"./src/**/*.md",
		"./src/**/*.mdx",
	],
	plugins: [daisyui],
	theme: {
		extend: {},
	},
}
