import { beforeEach, describe, expect, test, vi } from "vitest"

import type { Args } from "../args.js"

const { build } = vi.hoisted(() => ({
	build: vi.fn(),
}))

vi.mock("esbuild", () => ({
	build,
}))

import { bundleEntry } from "../shared.js"

describe("shared.ts", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test("bundles entry file with default and custom build config", async () => {
		const args: Args = {
			esBuildOptions: {
				banner: {
					js: "console.log(\'banner\')",
				},
				target: "node20",
			},
		}

		await bundleEntry("/tmp/entry.mjs", "/tmp/out", args)

		expect(build).toHaveBeenCalledTimes(1)
		expect(build).toHaveBeenCalledWith(
			expect.objectContaining({
				allowOverwrite: true,
				bundle: true,
				entryPoints: ["/tmp/entry.mjs"],
				external: ["aws-sdk", "sharp"],
				format: "esm",
				metafile: true,
				outExtension: {
					".js": ".mjs",
				},
				outdir: "/tmp/out",
				platform: "node",
				target: "node20",
			}),
		)
	})

	test("always prepends require banner", async () => {
		await bundleEntry("/tmp/entry.mjs", "/tmp/out", {
			esBuildOptions: {},
		})

		const config = build.mock.calls[0]?.[0]
		expect(config.banner.js).toContain("createRequire")
		expect(config.banner.js).toContain("const require")
	})
})
