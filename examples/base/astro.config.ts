import { env } from "node:process"

import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import tailwind from "@astrojs/tailwind"

const mode = env.MODE as "edge" | "ssr-stream" | "ssr"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		mode,
	}),
	integrations: [tailwind()],
	outDir: `./dist/${mode}`,
	output: "server",
})
