import { parse } from "flatted"

import type { RuntimeConfig } from "./runtime-config.js"
import { serializedConfig } from "virtual:@astro-aws/adapter:config"

const { binaryMediaTypes, includeRequestIdInLocals, locals, logger, mode } =
	parse(serializedConfig) as RuntimeConfig

export { binaryMediaTypes, includeRequestIdInLocals, locals, logger, mode }
