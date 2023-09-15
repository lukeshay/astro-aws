import { readFile } from "node:fs/promises"

export type PackageJson = {
	dependencies?: Record<string, string>
	devDependencies?: Record<string, string>
	name: string
	type?: "commonjs" | "module"
	version?: string
}

export const readPackageJson = async () =>
	JSON.parse(await readFile("./package.json", "utf-8")) as PackageJson
