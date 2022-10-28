import type { BuildOptions } from "esbuild";
import { build } from "esbuild";
import { mergeAndConcat } from "merge-anything";

import type { Args } from "./args.js";

const DEFAULT_CONFIG: BuildOptions = {
	bundle: true,
	external: ["aws-sdk"],
	platform: "node",
	target: "node16",
};

export const createEsBuildConfig = (entryFile: string, outDir: string, { esBuildOptions = {} }: Args) =>
	mergeAndConcat<BuildOptions, BuildOptions[]>(DEFAULT_CONFIG, esBuildOptions, {
		entryPoints: [entryFile],
		format: "cjs",
		outdir: outDir,
		outExtension: {
			".js": ".cjs",
		},
	});

export const bundleEntry = async (entryFile: string, outDir: string, args: Args) => {
	await build(createEsBuildConfig(entryFile, outDir, args));
};
