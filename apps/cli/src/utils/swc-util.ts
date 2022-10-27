import { resolve } from "node:path";
import { existsSync } from "node:fs";

export const findSwcConfig = (currentDir: string) =>
	existsSync(`${currentDir}/.swcrc`)
		? resolve(`${currentDir}/tsconfig.build.json`)
		: existsSync(`${currentDir}/../../.swcrc`)
		? resolve(`${currentDir}/../../.swcrc`)
		: undefined;
