import { build } from "esbuild";

export const bundleEntry = async (entryFile: string, outDir: string) => {
  await build({
    bundle: true,
    entryPoints: [entryFile],
    external: ["aws-sdk"],
    format: "cjs",
    outdir: outDir,
    platform: "node",
    target: "node16",
    outExtension: { ".js": ".cjs" },
  });
};
