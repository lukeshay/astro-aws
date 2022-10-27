import { resolve } from "node:path";
import { existsSync } from "node:fs";

import ts from "typescript";

export const findTsConfig = (currentDir: string) =>
	resolve(
		existsSync(`${currentDir}/tsconfig.build.json`)
			? `${currentDir}/tsconfig.build.json`
			: existsSync(`${currentDir}/tsconfig.json`)
			? `${currentDir}/tsconfig.json`
			: `${currentDir}/../../tsconfig.base.json`,
	);

export const emitTsDeclaration = (fileName: string, options: ts.CompilerOptions) => {
	const createdFiles: Record<string, string> = {};
	const host = ts.createCompilerHost(options);

	host.writeFile = (fileName2: string, contents: string) => {
		createdFiles[fileName2] = contents;
	};

	const tsProgram = ts.createProgram([fileName], options, host);

	tsProgram.emit();

	return createdFiles[fileName.replace(".t", ".d.t")] as unknown as string;
};
