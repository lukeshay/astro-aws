import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: ["text", "html"],
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90,
			},
		},
	},
})
