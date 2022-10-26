import { program } from "commander";

import { buildCommand } from "./cmds/build/index.js";

program.addCommand(buildCommand);
program.parse();
