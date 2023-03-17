import { build } from "tsup";
import { globby } from "globby";

import type { PackageJson } from "./pkg-util.js";
import { findTsConfig } from "./ts-util.js";

export type CreateConfigOptions = {
	bundle: boolean;
	clean: boolean;
	dts: boolean;
	fileGlob: string;
};

export const runTsupBuild = async (pkgJson: PackageJson, options: CreateConfigOptions) => {
	const { type = "module" } = pkgJson;
	const format = type === "module" ? "esm" : "cjs";
	const entryPoints = await globby([options.fileGlob, "!**/__tests__/**/*", "!**/*.spec.*", "!**/*.test.*"], {
		absolute: true,
		expandDirectories: true,
		onlyFiles: true,
		unique: true,
	});

	await build({
		bundle: options.bundle,
		clean: options.clean,
		dts: options.dts,
		entry: entryPoints,
		format,
		minify: true,
		platform: "node",
		target: "es2020",
		tsconfig: findTsConfig(),
	});
};
