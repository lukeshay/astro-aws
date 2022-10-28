import { build, BuildOptions } from "esbuild";
import { globby } from "globby";

import { findTsConfig } from "./ts-util.js";

const DEFAULT_CONFIG: BuildOptions = {
	minify: false,
	platform: "node",
	sourcemap: false,
	sourcesContent: false,
	target: "node14",
	outdir: "dist",
};

export type CreateConfigOptions = {
	bundle: boolean;
	fileGlob: string;
};

export const createEsBuildConfig = async (
	pkgJson: Record<string, string | number | boolean | undefined>,
	options: CreateConfigOptions,
) => {
	const { type = "module", version } = pkgJson;
	const { bundle, fileGlob } = options;
	const format = type === "module" ? "esm" : "cjs";
	const entryPoints = await globby([fileGlob], {
		absolute: true,
		expandDirectories: true,
		onlyFiles: true,
		unique: true,
	});

	return {
		...DEFAULT_CONFIG,
		bundle,
		define: {
			"process.env.PACKAGE_VERSION": JSON.stringify(version),
		},
		entryPoints,
		format,
		tsconfig: findTsConfig(),
	} as BuildOptions;
};

export const runEsBuild = async (
	pkgJson: Record<string, string | number | boolean | undefined>,
	options: CreateConfigOptions,
) => build(await createEsBuildConfig(pkgJson, options));
