import { Buffer } from "node:buffer";

import { polyfill } from "@astrojs/webapi";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import type { SSRManifest } from "astro";
import { App } from "astro/app";

import type { Args } from "./args.js";

polyfill(globalThis, {
	exclude: "window document",
});

const parseContentType = (header?: string) => header?.split(";")[0] ?? "";

const clientAddressSymbol = Symbol.for("astro.clientAddress");

export const createExports = (manifest: SSRManifest, { binaryMediaTypes, logFnResponse, logFnRequest }: Args) => {
	const app = new App(manifest);

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
		...(binaryMediaTypes ?? []),
	]);

	const handler: APIGatewayProxyHandlerV2 = async (event) => {
		if (logFnRequest) console.log("function request", JSON.stringify(event, undefined, 2));

		const {
			body: requestBody,
			cookies,
			headers: eventHeaders,
			isBase64Encoded,
			queryStringParameters = {},
			rawPath,
			requestContext: {
				domainName,
				http: { method },
			},
		} = event;

		const headers = new Headers(eventHeaders as HeadersInit);

		headers.set("cookies", cookies?.join("; ") ?? "");

		const init: RequestInit = {
			headers,
			method,
			referrer: headers.get("referrer") ?? `https://${domainName}`,
		};

		if (method !== "GET" && method !== "HEAD" && requestBody) {
			const encoding = isBase64Encoded ? "base64" : "utf-8";

			init.body = Buffer.from(requestBody, encoding);
		}

		const url = new URL(rawPath, init.referrer);

		Object.entries(queryStringParameters).forEach(([key, value]) => {
			if (value) {
				url.searchParams.set(key, value);
			}
		});

		const request = new Request(url, init);
		const routeData = app.match(request, { matchNotFound: true });

		if (!routeData) {
			return {
				body: "Not found",
				statusCode: 404,
			};
		}

		const ip = headers.get("x-forwarded-for");

		Reflect.set(request, clientAddressSymbol, ip);

		const response = await app.render(request, routeData);
		const responseHeaders = Object.fromEntries(response.headers.entries());
		const responseContentType = parseContentType(responseHeaders["content-type"]);
		const responseIsBase64Encoded = knownBinaryMediaTypes.has(responseContentType);
		const ab = await response.arrayBuffer();
		const responseBody = Buffer.from(ab).toString(responseIsBase64Encoded ? "base64" : "utf-8");

		const fnResponse = {
			body: responseBody,
			cookies: [...app.setCookieHeaders(response)],
			headers: responseHeaders,
			isBase64Encoded: responseIsBase64Encoded,
			statusCode: response.status,
		};

		if (logFnResponse) console.log("function response", JSON.stringify(fnResponse, undefined, 2));

		return fnResponse;
	};

	return { handler };
};
