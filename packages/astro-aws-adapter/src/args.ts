import type { BuildOptions } from "esbuild";

export type Args = {
	binaryMediaTypes?: string[];
	esBuildOptions?: Omit<BuildOptions, "bundle" | "entryPoints" | "outdir" | "platform">;
	logFnRequest?: boolean;
	logFnResponse?: boolean;
};
