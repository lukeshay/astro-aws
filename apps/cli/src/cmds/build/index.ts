import { Command } from "commander";

import { buildPackageCommand } from "./package.js";

const buildCommand = new Command("build");

buildCommand.addCommand(buildPackageCommand);

export { buildCommand };
