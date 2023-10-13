import { type ConstructorOptions as LoggerConstructorOptions } from "@aws-lambda-powertools/logger/lib/types"
import {
	type MetricsOptions,
	type ExtraOptions,
} from "@aws-lambda-powertools/metrics/lib/types"
import { type TracerOptions } from "@aws-lambda-powertools/tracer/lib/types"
import type { BuildOptions } from "esbuild"

import {
	type WithLoggerOptions,
	type WithTracerOptions,
} from "./lambda/middleware.js"

type EsBuildOptions = Omit<
	BuildOptions,
	"bundle" | "entryPoints" | "outdir" | "platform"
>

type Args = {
	/** Specifies what media types need to be base64 encoded. */
	binaryMediaTypes: string[]
	/** Configures ESBuild options that are not configured automatically. */
	esBuildOptions: EsBuildOptions
	/** Astro.locals that you want passed into the application. */
	locals: object
	/** Specifies where you want your app deployed to. */
	mode: "edge" | "ssr-stream" | "ssr"
	/** Configuration for powertools. */
	powertools?: {
		middleware?: {
			logger?: WithLoggerOptions
			metrics?: ExtraOptions
			tracer?: WithTracerOptions
		}
		options?: {
			logger?: LoggerConstructorOptions
			metrics?: MetricsOptions
			tracer?: TracerOptions
		}
	}
}

export { type EsBuildOptions, type Args }
