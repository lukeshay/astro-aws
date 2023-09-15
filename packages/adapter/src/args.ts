import type { BuildOptions } from "esbuild"

type EsBuildOptions = Omit<
	BuildOptions,
	"bundle" | "entryPoints" | "outdir" | "platform"
>

type Args = {
	/** Specifies what media types need to be base64 encoded. */
	binaryMediaTypes?: string[]
	/** Configures ESBuild options that are not configured automatically. */
	esBuildOptions?: EsBuildOptions
	/** Enables a log message that prints the request the lambda receives. */
	logFnRequest?: boolean
	/** Enables a log message that prints the response the lambda returns. */
	logFnResponse?: boolean
}

export { type EsBuildOptions, type Args }
