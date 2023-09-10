import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import type { AstroAdapter, AstroConfig, AstroIntegration } from "astro"

import type { Args } from "./args.js"
import { bundleEntry } from "./shared.js"
import { ADAPTER_NAME } from "./constants.js"
import { warn } from "./log.js"

export const getAdapter = (args: Args = {}): AstroAdapter => ({
	args,
	exports: ["handler"],
	name: ADAPTER_NAME,
	serverEntrypoint: `${ADAPTER_NAME}/lambda/index.js`,
})

export const astroAWSFunctions = (args: Args = {}): AstroIntegration => {
	let astroConfig: AstroConfig

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
				setAdapter(getAdapter(args))

				astroConfig = config

				if (config.output === "static") {
					warn('`output: "server"` is required to use this adapter.')
					warn(
						"Otherwise, this adapter is not required to deploy a static site to AWS.",
					)
				}
			},
			"astro:build:done": async ({ routes }) => {
				await writeFile(
					fileURLToPath(new URL("routes.json", astroConfig.outDir)),
					JSON.stringify(routes, undefined, 2),
				)

				const invalidationPaths = routes.map((route) => route.route)

				await writeFile(
					fileURLToPath(new URL("invalidationPaths.json", astroConfig.outDir)),
					JSON.stringify(invalidationPaths, undefined, 2),
				)

				await bundleEntry(
					fileURLToPath(
						new URL(astroConfig.build.serverEntry, astroConfig.build.server),
					),
					fileURLToPath(new URL("lambda", astroConfig.outDir)),
					args,
				)
			},
		},
	}
	/* eslint-enable sort-keys */
}

export default astroAWSFunctions
