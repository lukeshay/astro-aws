import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		logFnRequest: true,
		logFnResponse: true,
	}),
	output: "server",
})
