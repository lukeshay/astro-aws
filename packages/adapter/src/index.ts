import { fileURLToPath } from "node:url"
import { cp, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"

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

type Metadata = {
	args?: Args
	config?: AstroConfig
}

const getAdapter = (args: Partial<Args> = {}): AstroAdapter => ({
	adapterFeatures: {
		edgeMiddleware: false,
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
		sharpImageService: (args.mode ?? DEFAULT_ARGS.mode) === "edge" ? "unsupported" : "stable",
		hybridOutput: "stable",
		serverOutput: "stable",
		staticOutput: "unsupported",
		envGetSecret: "unsupported",
	},
})

const astroAWSFunctions = (args: Partial<Args> = {}): AstroIntegration => {
	const argsWithDefault: Args = {
		...DEFAULT_ARGS,
		...args,
	}

	const metadata: Metadata = {
		args: argsWithDefault,
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
					image: {
						service: {
							entrypoint: "astro/assets/services/sharp",
						},
					},
				})
			},
			"astro:config:done": ({ config, setAdapter }) => {
				setAdapter(getAdapter(argsWithDefault))

				metadata.config = config

				if (config.output === "static") {
					warn('`output: "server"` is required to use this adapter.')
					warn(
						"Otherwise, this adapter is not required to deploy a static site to AWS.",
					)
				}
			},
			"astro:build:done": async (options) => {
				await writeFile(
					fileURLToPath(new URL("metadata.json", metadata.config!.outDir)),
					stringify({
						...metadata,
						options,
					}),
				)

				const lambdaOutDir = fileURLToPath(
					new URL("lambda", metadata.config!.outDir),
				)

				const clientAssetsOutDir = join(lambdaOutDir, "client", "_astro")
				const clientAssetsSourceDir = fileURLToPath(
					new URL("_astro", metadata.config!.build.client),
				)

				await mkdir(clientAssetsOutDir, {
					recursive: true,
				})

				try {
					await cp(clientAssetsSourceDir, clientAssetsOutDir, {
						recursive: true,
					})
				} catch {
					// _astro directory may not exist if no static assets
				}

				await bundleEntry(
					fileURLToPath(
						new URL(
							metadata.config!.build.serverEntry,
							metadata.config!.build.server,
						),
					),
					lambdaOutDir,
					argsWithDefault,
				)
			},
		},
	}
	/* eslint-enable sort-keys */
}

export default astroAWSFunctions
export { getAdapter, astroAWSFunctions }
