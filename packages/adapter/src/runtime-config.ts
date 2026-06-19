import type { Args } from "./args.js"

type RuntimeConfig = Pick<
	Args,
	"binaryMediaTypes" | "includeRequestIdInLocals" | "locals" | "logger" | "mode"
>

const toRuntimeConfig = (args: Args): RuntimeConfig => ({
	binaryMediaTypes: args.binaryMediaTypes ?? [],
	includeRequestIdInLocals: args.includeRequestIdInLocals,
	locals: args.locals ?? {},
	logger: args.logger,
	mode: args.mode ?? "ssr",
})

export { type RuntimeConfig, toRuntimeConfig }
