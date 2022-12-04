import { polyfill } from "@astrojs/webapi";
import type { SSRManifest } from "astro";
import { App } from "astro/app";

import type { Args } from "../args.js";

import { createHandler } from "./handler.js";

polyfill(globalThis, {
	exclude: "window document",
});

export const createExports = (manifest: SSRManifest, args: Args) => {
	const app = new App(manifest);

	const { binaryMediaTypes = [] } = args;

	const knownBinaryMediaTypes = new Set([
		"audio/3gpp",
		"audio/3gpp2",
		"audio/aac",
		"audio/midi",
		"audio/mpeg",
		"audio/ogg",
		"audio/opus",
		"audio/wav",
		"audio/webm",
		"audio/x-midi",
		"image/avif",
		"image/bmp",
		"image/gif",
		"image/heif",
		"image/ico",
		"image/jpeg",
		"image/png",
		"image/svg+xml",
		"image/tiff",
		"image/vnd.microsoft.icon",
		"image/webp",
		"video/3gpp",
		"video/3gpp2",
		"video/mp2t",
		"video/mp4",
		"video/mpeg",
		"video/ogg",
		"video/webm",
		"video/x-msvideo",
		...binaryMediaTypes,
	]);

	const handler = createHandler(app, knownBinaryMediaTypes, args);

	return { handler };
};
