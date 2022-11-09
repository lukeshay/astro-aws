import type { BuildOptions } from "esbuild";

export type Args = {
	binaryMediaTypes?: string[];
	esBuildOptions?: Omit<BuildOptions, "bundle" | "entryPoints" | "outdir" | "platform">;
	esm?: boolean;
	logFnRequest?: boolean;
	logFnResponse?: boolean;
	logRequest?: boolean;
	logResponse?: boolean;
};
