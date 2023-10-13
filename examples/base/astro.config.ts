import { env } from "node:process"

import { defineConfig } from "astro/config"
import aws from "@astro-aws/adapter"
import tailwind from "@astrojs/tailwind"

const mode = env.MODE as "edge" | "ssr-stream" | "ssr"

// https://astro.build/config
export default defineConfig({
	adapter: aws({
		mode,
		powertools: {
			middleware: {
				logger: {
					logErrors: true,
					logEvent: true,
					logResult: true,
				},
				metrics: {
					captureColdStartMetric: true,
				},
				tracer: {
					captureResponse: true,
				},
			},
			options: {
				logger: {
					logLevel: "DEBUG",
					sampleRateValue: 1,
					serviceName: "astro-aws",
				},
				metrics: {
					namespace: "astro-aws",
					serviceName: "astro-aws",
				},
				tracer: {
					captureHTTPsRequests: true,
					serviceName: "astro-aws",
				},
			},
		},
	}),
	integrations: [tailwind()],
	outDir: `./dist/${mode}`,
	output: "server",
})
