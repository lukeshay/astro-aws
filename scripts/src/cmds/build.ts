import { rm } from "node:fs/promises"

import { Command } from "commander"

import { runTsc } from "../utils/ts-util.js"
import { runEsBuild } from "../utils/esbuild-util.js"
import { readPackageJson } from "../utils/pkg-util.js"
import { readConfig } from "../utils/config-util.js"
import { none } from "../utils/arg-util.js"

type Options = {
	bundle: boolean
	skipClean: boolean
	skipTsc: boolean
}

const buildCommand = new Command("build")
	.description(
		"Builds the TypeScript files in the src directory and outputs them to the dist directory.",
	)
	.argument("[fileGlob]", "Glob pattern for files to build.", "src/**/*.ts")
	.option("-b, --bundle", "Bundles the entrypoint.", false)
	.option("--skip-clean", "Does not delete dist folder.", false)
	.option("--skip-tsc", "Skips building typedefs.", false)
	.action(async (fileGlob: string) => {
		const { bundle, skipClean, skipTsc } = buildCommand.opts<Options>()
		const pkgJson = await readPackageJson()
		const config = await readConfig()

		if (none(skipClean, config.build?.skipClean)) {
			const cleanGlobs = [...(config.clean ?? []), "dist"]

			await Promise.all(
				cleanGlobs.map(async (glob) =>
					rm(glob, {
						force: true,
						recursive: true,
					}),
				),
			)
		}

		await runEsBuild(pkgJson, {
			bundle,
			fileGlob,
		})

		if (none(skipTsc, config.build?.skipTsc)) {
			runTsc()
		}
	})

export { buildCommand }
