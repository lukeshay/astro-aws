import { readFile } from "node:fs/promises";

export const readPackageJson = async () => JSON.parse(await readFile("./package.json", "utf-8"));
