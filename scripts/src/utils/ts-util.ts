import { resolve } from "node:path"
import { existsSync } from "node:fs"

import { runCommand } from "./shell-util.js"

const findTsConfigPath = () =>
	existsSync("./tsconfig.build.json")
		? "./tsconfig.build.json"
		: existsSync("./tsconfig.json")
		? "./tsconfig.json"
		: existsSync("../tsconfig.base.json")
		? "../tsconfig.base.json"
		: "../../tsconfig.base.json"

export const findTsConfig = () => resolve(findTsConfigPath())

export const runTsc = () => {
	runCommand(
		"tsc",
		"--project",
		findTsConfigPath(),
		"--declaration",
		"--emitDeclarationOnly",
		"--outDir",
		"dist",
	)
}
