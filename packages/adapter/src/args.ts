import type { BuildOptions } from "esbuild"

type EsBuildOptions = Omit<
	BuildOptions,
	"bundle" | "entryPoints" | "outdir" | "platform"
>

type Args = {
	/** Specifies what media types need to be base64 encoded. */
	binaryMediaTypes: string[]
	/** Configures ESBuild options that are not configured automatically. */
	esBuildOptions: EsBuildOptions
	/** Specifies where you want your app deployed to. */
	mode: "edge" | "ssr-stream" | "ssr"
}

export { type EsBuildOptions, type Args }
