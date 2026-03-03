import type { BuildOptions } from "esbuild"
import { build } from "esbuild"
import { mergeAndConcat } from "merge-anything"

import type { Args } from "./args.js"

type BundleEntryOptions = {
	additionalExternals?: string[]
	outName?: string
}

const DEFAULT_CONFIG: BuildOptions = {
	allowOverwrite: true,
	bundle: true,
	external: ["aws-sdk"],
	metafile: true,
	platform: "node",
	target: "node16",
}

const bundleEntry = async (
	entryFile: string,
	outDir: string,
	args: Args,
	options?: BundleEntryOptions,
) => {
	const config: BuildOptions = mergeAndConcat(
		DEFAULT_CONFIG,
		args.esBuildOptions,
		{
			banner: {
				js: [
					"import { createRequire as topLevelCreateRequire } from 'module';",
					"const require = topLevelCreateRequire(import.meta.url);",
					args.esBuildOptions?.banner?.js ?? "",
				].join(""),
			},
			entryPoints: options?.outName
				? [
						{
							in: entryFile,
							out: options.outName,
						},
					]
				: [entryFile],
			format: "esm",
			outdir: outDir,
			outExtension: {
				".js": ".mjs",
			},
		} satisfies BuildOptions,
	)

	if (options?.additionalExternals?.length) {
		config.external = [
			...new Set([...(config.external ?? []), ...options.additionalExternals]),
		]
	}

	await build(config)
}

export { type BundleEntryOptions, bundleEntry }
