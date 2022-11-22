import { rm } from "node:fs/promises";

import { Command } from "commander";

import { runTsc } from "../utils/ts-util.js";
import { runEsBuild } from "../utils/esbuild-util.js";
import { readPackageJson } from "../utils/pkg-util.js";

type Options = {
	bundle: boolean;
	skipClean: boolean;
	skipTsc: boolean;
};

const buildCommand = new Command("build")
	.description("Builds the TypeScript files in the src directory and outputs them to the dist directory.")
	.argument("[fileGlob]", "Glob pattern for files to build.", "src/**/*.ts")
	.option("-b, --bundle", "Bundles the entrypoint.", false)
	.option("--skip-clean", "Does not delete dist folder.", false)
	.option("--skip-tsc", "Skips building typedefs.", false)
	.action(async (fileGlob: string) => {
		const { bundle, skipClean, skipTsc } = buildCommand.opts<Options>();
		const pkgJson = await readPackageJson();

		if (!skipClean) {
			await rm("dist", {
				force: true,
				recursive: true,
			});
		}

		await runEsBuild(pkgJson, {
			bundle,
			fileGlob,
		});

		if (!skipTsc) {
			runTsc();
		}
	});

export { buildCommand };
