import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import type { AstroAdapter, AstroConfig, AstroIntegration } from "astro";

import type { Args } from "./args.js";
import { bundleEntry } from "./shared.js";
import { ADAPTER_NAME } from "./constants.js";
import { warn } from "./log.js";

export const getAdapter = (args: Args = {}): AstroAdapter => {
	return {
		name: ADAPTER_NAME,
		serverEntrypoint: `${ADAPTER_NAME}/lambda.js`,
		exports: ["handler"],
		args,
	};
};

const getBuildPath = (root: string | URL, path?: string) => {
	const distURL = new URL("./dist/", root);

	return path ? new URL(path, distURL) : distURL;
};

export const astroAWSFunctions = (args: Args = {}): AstroIntegration => {
	let astroConfig: AstroConfig;

	return {
		name: "@astro-aws/adapter",
		hooks: {
			"astro:config:setup": ({ config, updateConfig }) => {
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
				setAdapter(getAdapter(args));

				astroConfig = config;

				if (config.output === "static") {
					warn('`output: "server"` is required to use this adapter.');
					warn("Otherwise, this adapter is not required to deploy a static site to AWS.");
				}
			},
			"astro:build:done": async ({ routes }) => {
				await writeFile(
					fileURLToPath(getBuildPath(astroConfig.root, "./routes.json")),
					JSON.stringify(routes, null, 2),
				);

				await bundleEntry(
					fileURLToPath(new URL(astroConfig.build.serverEntry, astroConfig.build.server)),
					fileURLToPath(astroConfig.build.server).replace("/server", "/lambda"),
				);
			},
		},
	};
};

export default astroAWSFunctions;
