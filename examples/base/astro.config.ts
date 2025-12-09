import { env } from "node:process"

import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import tailwindcss from "@tailwindcss/vite"

const mode = env.MODE as "edge" | "ssr-stream" | "ssr"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		mode,
	}),
	vite: {
		plugins: [tailwindcss()],
	},
	outDir: `./dist/${mode}`,
	output: "server",
})
