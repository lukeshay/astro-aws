import type { BuildOptions } from "esbuild";
import { build } from "esbuild";
import { mergeAndConcat } from "merge-anything";

import type { Args } from "./args.js";

const DEFAULT_CONFIG = {
	bundle: true,
	external: ["aws-sdk"],
	platform: "node",
	target: "node16",
};

export const createEsBuildConfig = (entryFile: string, outDir: string, { esBuildOptions = {} }: Args) =>
	mergeAndConcat(DEFAULT_CONFIG, esBuildOptions, {
		banner: {
			js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
		},
		entryPoints: [entryFile],
		format: "esm",
		outdir: outDir,
		outExtension: {
			".js": ".mjs",
		},
	}) as BuildOptions;

export const bundleEntry = async (entryFile: string, outDir: string, args: Args) => {
	await build(createEsBuildConfig(entryFile, outDir, args));
};
