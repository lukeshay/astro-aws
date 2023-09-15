import { program } from "commander"

import { buildCommand } from "./cmds/build.js"

program.addCommand(buildCommand)
program.parse()
