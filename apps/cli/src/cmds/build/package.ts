import { writeFile, mkdir, rm, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";
import { cwd } from "node:process";

import type { Options } from "@swc/core";
import { transformFile } from "@swc/core";
import { Command } from "commander";
import { globby } from "globby";
import ts from "typescript";

const buildPackageCommand = new Command("package");

const emitDeclaration = (fileName: string, options: ts.CompilerOptions) => {
	const createdFiles: Record<string, string> = {};
	const host = ts.createCompilerHost(options);

	host.writeFile = (fileName2: string, contents: string) => {
		createdFiles[fileName2] = contents;
	};

	const tsProgram = ts.createProgram([fileName], options, host);

	tsProgram.emit();

	return createdFiles[fileName.replace(".t", ".d.t")] as unknown as string;
};

const findTsConfig = (currentDir: string) =>
	resolve(
		existsSync(`${currentDir}/tsconfig.build.json`)
			? `${currentDir}/tsconfig.build.json`
			: existsSync(`${currentDir}/tsconfig.json`)
			? `${currentDir}/tsconfig.json`
			: `${currentDir}/../../tsconfig.base.json`,
	);

const findSwcConfig = (currentDir: string) =>
	existsSync(`${currentDir}/.swcrc`)
		? resolve(`${currentDir}/tsconfig.build.json`)
		: existsSync(`${currentDir}/../../.swcrc`)
		? resolve(`${currentDir}/../../.swcrc`)
		: undefined;

buildPackageCommand.action(async () => {
	const files = await globby(["src/**/*"]);
	const currentDir = cwd();

	console.log("Building files:", files);

	const rawTsConfig = await readFile(findTsConfig(currentDir), "utf-8");
	const tsConfig = JSON.parse(rawTsConfig) as ts.CompilerOptions;
	const swcConfigPath = findSwcConfig(currentDir);

	const swcConfig: Options = swcConfigPath
		? (JSON.parse(await readFile(swcConfigPath, "utf-8")) as Options)
		: {
				jsc: {
					parser: {
						syntax: "typescript",
					},
					target: "es2020",
				},
				minify: true,
				module: {
					strict: true,
					strictMode: true,
					type: "es6",
				},
				sourceMaps: "inline",
		  };

	const codeToWrite = await Promise.all(
		files
			.map((file) => join(currentDir, file))
			.map(async (file) => {
				const output = await transformFile(file, swcConfig);

				const typeDefs = emitDeclaration(file, {
					...tsConfig,
					declaration: true,
					emitDeclarationOnly: true,
				});

				return {
					code: output.code,
					file: file.replace("src/", "dist/").replace(".t", ".j"),
					typeDefs,
					typeDefsFile: file.replace("src/", "dist/").replace(".t", ".d.t"),
				};
			}),
	);

	console.log(
		"Writing files:",
		codeToWrite.flatMap(({ file, typeDefsFile }) => [
			file.replace(`${currentDir}/`, ""),
			typeDefsFile.replace(`${currentDir}/`, ""),
		]),
	);

	await rm("dist", {
		force: true,
		recursive: true,
	});

	await Promise.all(
		codeToWrite.map(async ({ file, code, typeDefs, typeDefsFile }) => {
			await mkdir(dirname(file), { recursive: true });
			await writeFile(file, code);
			await writeFile(typeDefsFile, typeDefs);
		}),
	);
});

export { buildPackageCommand };
