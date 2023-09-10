/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	daisyui: {
		themes: [
			"dracula",
			{
				"astro-aws": {
					...require("daisyui/src/colors/themes")["[data-theme=dracula]"],
					primary: "#9456e5",
					"primary-content": "#290C4F",
					"primary-focus": "#5C1BB0",
				},
			},
		],
	},
	plugins: [require("daisyui")],
	theme: {
		extend: {},
	},
}
