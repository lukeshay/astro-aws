import type { BuildOptions } from "esbuild"

import { type WithLoggerOptions } from "./lambda/middleware.js"

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
	/** Make request id available in Astro.locals  */
	includeRequestIdInLocals?: boolean
	/** Specifies where you want your app deployed to. */
	mode: "edge" | "ssr-stream" | "ssr"
	/** Settings for logging. */
	logger?: WithLoggerOptions

	customErrors: {
		// "redirect" will redirect to /404 page where as
		// "render" will render 404 page while remaining on the same page
		error4xx?: "redirect" | "render"
	}
}

export { type EsBuildOptions, type Args }
