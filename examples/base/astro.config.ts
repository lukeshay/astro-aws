import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		logFnRequest: true,
		logFnResponse: true,
	}),
	integrations: [tailwind()],
	output: "hybrid",
})
