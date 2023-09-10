import type { BuildOptions } from "esbuild"
import { build } from "esbuild"
import { globby } from "globby"

import type { PackageJson } from "./pkg-util.js"
import { findTsConfig } from "./ts-util.js"

const DEFAULT_CONFIG: BuildOptions = {
	minify: false,
	outdir: "dist",
	platform: "node",
	sourcemap: false,
	sourcesContent: false,
	target: "node14",
}

export type CreateConfigOptions = {
	bundle: boolean
	fileGlob: string
}

export const createEsBuildConfig = async (
	pkgJson: PackageJson,
	options: CreateConfigOptions,
): Promise<BuildOptions> => {
	const { type = "module", version } = pkgJson
	const { bundle, fileGlob } = options
	const format = type === "module" ? "esm" : "cjs"
	const entryPoints = await globby(
		[fileGlob, "!**/__tests__/**/*", "!**/*.spec.*", "!**/*.test.*"],
		{
			absolute: true,
			expandDirectories: true,
			onlyFiles: true,
			unique: true,
		},
	)

	return {
		...DEFAULT_CONFIG,
		bundle,
		define: {
			"process.env.PACKAGE_VERSION": JSON.stringify(version),
		},
		entryPoints,
		format,
		tsconfig: findTsConfig(),
	}
}

export const runEsBuild = async (
	pkgJson: PackageJson,
	options: CreateConfigOptions,
) => build(await createEsBuildConfig(pkgJson, options))
