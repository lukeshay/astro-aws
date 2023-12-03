import type { BuildOptions } from "esbuild"
import { build } from "esbuild"
import { mergeAndConcat } from "merge-anything"

import type { Args } from "./args.js"

const DEFAULT_CONFIG: BuildOptions = {
	allowOverwrite: true,
	bundle: true,
	external: ["aws-sdk"],
	metafile: true,
	platform: "node",
}

const bundleEntry = async (entryFile: string, outDir: string, args: Args) => {
	const config = mergeAndConcat(DEFAULT_CONFIG, args.esBuildOptions, {
		banner: {
			js: [
				"import { createRequire as topLevelCreateRequire } from 'module';",
				"const require = topLevelCreateRequire(import.meta.url);",
				args.esBuildOptions.banner?.js ?? "",
			].join(""),
		},
		entryPoints: [entryFile],
		format: "esm",
		outdir: outDir,
		outExtension: {
			".js": ".mjs",
		},
	} satisfies BuildOptions)

	await build(config)
}

export { bundleEntry }
