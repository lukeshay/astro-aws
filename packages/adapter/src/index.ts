import { fileURLToPath } from "node:url"
import { writeFile } from "node:fs/promises"

import { stringify } from "flatted"
import type { AstroAdapter, AstroConfig, AstroIntegration } from "astro"

import type { Args } from "./args.js"
import { bundleEntry } from "./shared.js"
import { ADAPTER_NAME } from "./constants.js"
import { warn } from "./log.js"

const DEFAULT_ARGS: Args = {
	binaryMediaTypes: [],
	esBuildOptions: {},
	locals: {},
	mode: "ssr",
}

const getAdapter = (args: Partial<Args> = {}): AstroAdapter => ({
	adapterFeatures: {
		edgeMiddleware: false,
		functionPerRoute: false,
	},
	args: {
		...DEFAULT_ARGS,
		...args,
	},
	exports: ["handler"],
	name: ADAPTER_NAME,
	serverEntrypoint: `${ADAPTER_NAME}/lambda/handlers/${
		args.mode ?? DEFAULT_ARGS.mode
	}.js`,
	supportedAstroFeatures: {
		assets: {
			isSharpCompatible: false,
			isSquooshCompatible: false,
			supportKind: "stable",
		},
		hybridOutput: "stable",
		serverOutput: "stable",
		staticOutput: "unsupported",
	},
})

const astroAWSFunctions = (args: Partial<Args> = {}): AstroIntegration => {
	let astroConfig: AstroConfig

	const argsWithDefault: Args = {
		...DEFAULT_ARGS,
		...args,
	}

	/* eslint-disable sort-keys */
	return {
		name: ADAPTER_NAME,
		hooks: {
			"astro:config:setup": ({ config, updateConfig }) => {
				updateConfig({
					build: {
						client: new URL("client/", config.outDir),
						server: new URL("server/", config.outDir),
						serverEntry: "entry.mjs",
					},
				})
			},
			"astro:config:done": ({ config, setAdapter }) => {
				setAdapter(getAdapter(argsWithDefault))

				astroConfig = config

				if (config.output === "static") {
					warn('`output: "server"` is required to use this adapter.')
					warn(
						"Otherwise, this adapter is not required to deploy a static site to AWS.",
					)
				}
			},
			"astro:build:done": async (options) => {
				await writeFile(
					fileURLToPath(new URL("metadata.json", astroConfig.outDir)),
					stringify({
						args: argsWithDefault,
						options,
						config: astroConfig,
					}),
				)

				await bundleEntry(
					fileURLToPath(
						new URL(astroConfig.build.serverEntry, astroConfig.build.server),
					),
					fileURLToPath(new URL("lambda", astroConfig.outDir)),
					argsWithDefault,
				)
			},
		},
	}
	/* eslint-enable sort-keys */
}

export default astroAWSFunctions
export { getAdapter, astroAWSFunctions }
