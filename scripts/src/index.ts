import { program } from "commander"

import { buildCommand } from "./cmds/build.js"
import { verifyPRCommand } from "./cmds/verify-pr.js"

program.addCommand(buildCommand)
program.addCommand(verifyPRCommand)
program.parse()
