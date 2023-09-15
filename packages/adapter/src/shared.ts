import type { BuildOptions } from "esbuild";
import { build } from "esbuild";
import { mergeAndConcat } from "merge-anything";

import type { Args } from "./args.js";

const DEFAULT_CONFIG: BuildOptions = {
	allowOverwrite: true,
	bundle: true,
	external: ["aws-sdk"],
	metafile: true,
	platform: "node",
	target: "node16",
};

export const createEsBuildConfig = (
  entryFile: string,
  outDir: string,
  { esBuildOptions = {} }: Args
) =>
  mergeAndConcat(DEFAULT_CONFIG, esBuildOptions, {
    banner: {
      js: [
        "import { createRequire as topLevelCreateRequire } from 'module';",
        'const require = topLevelCreateRequire(import.meta.url);',
        esBuildOptions.banner?.js ?? '',
      ].join(''),
    },
    entryPoints: [entryFile],
    format: 'esm',
    outdir: outDir,
    outExtension: {
      '.js': '.mjs',
    },
  }) as BuildOptions

export const bundleEntry = async (entryFile: string, outDir: string, args: Args) => {
	await build(createEsBuildConfig(entryFile, outDir, args));
};
