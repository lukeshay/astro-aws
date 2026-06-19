import { env } from "node:process"

import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import tailwindcss from "@tailwindcss/vite"

const mode = env.MODE as "edge" | "ssr-stream" | "ssr"
const outputSetting = env.OUTPUT as "hybrid" | "server" | "static" | undefined
// Astro v6 removed `output: "hybrid"`; `static` with on-demand routes is the equivalent.
const output =
	outputSetting === "hybrid" || outputSetting === "static" ? "static" : "server"
const distSuffix = output === "static" ? `${mode}-static` : mode

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		mode,
	}),
	vite: {
		plugins: [tailwindcss()],
	},
	outDir: `./dist/${distSuffix}`,
	cacheDir: `./.cache/${distSuffix}`,
	output,
})
