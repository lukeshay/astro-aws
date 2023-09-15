import { execSync } from "node:child_process"

export const runCommand = (...command: string[]) =>
	execSync(command.join(" "), { stdio: "inherit" })
