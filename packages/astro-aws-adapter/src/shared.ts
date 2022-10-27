import { build } from "esbuild";

export const bundleEntry = async (entryFile: string, outDir: string) => {
	await build({
		bundle: true,
		entryPoints: [entryFile],
		external: ["aws-sdk"],
		format: "cjs",
		outdir: outDir,
		outExtension: {
			".js": ".cjs",
		},
		platform: "node",
		target: "node16",
	});
};
