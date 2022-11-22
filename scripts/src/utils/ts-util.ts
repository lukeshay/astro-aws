import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const findTsConfigPath = () =>
	existsSync("./tsconfig.build.json")
		? "./tsconfig.build.json"
		: existsSync("./tsconfig.json")
		? "./tsconfig.json"
		: existsSync("../tsconfig.base.json")
		? "../tsconfig.base.json"
		: "../../tsconfig.base.json";

export const findTsConfig = () => resolve(findTsConfigPath());

export const runTsc = () => {
	execSync(`tsc --project ${findTsConfigPath()} --declaration --emitDeclarationOnly --outDir dist`);
};
