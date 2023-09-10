import { polyfill } from "@astrojs/webapi"
import type { SSRManifest } from "astro"
import { NodeApp } from "astro/app/node"

import type { Args } from "../args.js"

import { createHandler } from "./handler.js"

polyfill(globalThis, {
	exclude: "window document",
})

export const createExports = (manifest: SSRManifest, args: Args) => {
	const app = new NodeApp(manifest)

	const { binaryMediaTypes = [] } = args

	const knownBinaryMediaTypes = new Set([
		"application/epub+zip",
		"application/java-archive",
		"application/msword",
		"application/octet-stream",
		"application/pdf",
		"application/rtf",
		"application/vnd.amazon.ebook",
		"application/vnd.apple.installer+xml",
		"application/vnd.ms-excel",
		"application/vnd.ms-powerpoint",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/x-7z-compressed",
		"application/x-apple-diskimage",
		"application/x-bzip",
		"application/x-bzip2",
		"application/x-gzip",
		"application/x-java-archive",
		"application/x-rar-compressed",
		"application/x-tar",
		"application/x-zip",
		"application/zip",
		"audio/3gpp",
		"audio/aac",
		"audio/basic",
		"audio/mpeg",
		"audio/ogg",
		"audio/wavaudio/webm",
		"audio/x-aiff",
		"audio/x-midi",
		"audio/x-wav",
		"font/otf",
		"font/woff",
		"font/woff2",
		"image/bmp",
		"image/gif",
		"image/jpeg",
		"image/png",
		"image/tiff",
		"image/vnd.microsoft.icon",
		"image/webp",
		"video/3gpp",
		"video/mp2t",
		"video/mpeg",
		"video/ogg",
		"video/quicktime",
		"video/webm",
		"video/x-msvideo",
		...binaryMediaTypes,
	])

	const handler = createHandler(app, knownBinaryMediaTypes, args)

	return { handler }
}
