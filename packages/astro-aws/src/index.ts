import type { AstroAdapter, AstroConfig, AstroIntegration } from "astro";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import type { Args } from "./lambda.js";
import { bundleEntry } from "./shared.js";

export const getAdapter = (args: Args = {}): AstroAdapter => {
  return {
    name: "astro-aws",
    serverEntrypoint: "astro-aws/lambda.js",
    exports: ["handler"],
    args,
  };
};

interface AstroAWSOptions {
  binaryMediaTypes?: string[];
}

const getBuildPath = (root: string | URL, path?: string) => {
  const distURL = new URL("./dist/", root);

  return path ? new URL(path, distURL) : distURL;
};

export const astroAWSFunctions = ({
  binaryMediaTypes,
}: AstroAWSOptions = {}): AstroIntegration => {
  let _config: AstroConfig;
  let entryFile: string;
  let needsBuildConfig = false;

  return {
    name: "astro-aws",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        needsBuildConfig = !config.build.client;

        updateConfig({
          outDir: getBuildPath(config.root),
          build: {
            client: getBuildPath(config.root, "./client/"),
            server: getBuildPath(config.root, "./server/"),
            serverEntry: "entry.mjs",
          },
        });
      },
      "astro:config:done": ({ config, setAdapter }) => {
        setAdapter(getAdapter({ binaryMediaTypes }));

        _config = config;
        entryFile = config.build.serverEntry.replace(/\.m?js/, "");

        if (config.output === "static") {
          console.warn(
            `[astro-aws] \`output: "server"\` is required to use this adapter.`
          );
          console.warn(
            `[astro-aws] Otherwise, this adapter is not required to deploy a static site to Netlify.`
          );
        }
      },
      "astro:build:start": ({ buildConfig }) => {
        if (needsBuildConfig) {
          buildConfig.client = _config.outDir;
          buildConfig.server = new URL(
            "./.netlify/functions-internal/",
            _config.root
          );
          entryFile = buildConfig.serverEntry.replace(/\.m?js/, "");
        }
      },
      "astro:build:done": async ({ routes }) => {
        await writeFile(
          fileURLToPath(getBuildPath(_config.root, "./routes.json")),
          JSON.stringify(routes, null, 2)
        );

        await bundleEntry(
          fileURLToPath(
            new URL(_config.build.serverEntry, _config.build.server)
          ),
          fileURLToPath(_config.build.server).replace("/server", "/assets")
        );
      },
    },
  };
};

export default astroAWSFunctions;
