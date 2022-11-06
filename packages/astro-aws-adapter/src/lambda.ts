// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { Buffer } from "node:buffer";

import { polyfill } from "@astrojs/webapi";
import type { Handler } from "aws-lambda";
import type { SSRManifest } from "astro";
import { App } from "astro/app";

import type { Args } from "./args.js";

polyfill(globalThis, {
	exclude: "window document",
});

const parseContentType = (header?: string) => header?.split(";")[0] ?? "";

const clientAddressSymbol = Symbol.for("astro.clientAddress");

type Event = {
	version: string;
	routeKey: string;
	rawPath: string;
	rawQueryString: string;
	headers: Record<string, string>;
	body?: string;
	queryStringParameters?: Record<string, string>;
	requestContext: {
		accountId: string;
		apiId: string;
		domainName: string;
		domainPrefix: string;
		http: {
			method: string;
			path: string;
			protocol: string;
			sourceIp: string;
			userAgent: string;
		};
		requestId: string;
		routeKey: string;
		stage: string;
		time: string;
		timeEpoch: number;
	};
	isBase64Encoded: boolean;
};

export const createExports = (manifest: SSRManifest, { binaryMediaTypes }: Args) => {
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

	const handler: Handler<Event> = async (event) => {
		console.log(JSON.stringify(event, undefined, 2));

		const {
			body: requestBody,
			isBase64Encoded,
			rawPath,
			queryStringParameters = {},
			requestContext: {
				domainName,
				http: { method },
			},
			headers: eventHeaders,
		} = event;

		const headers = new Headers(eventHeaders);
		const init: RequestInit = {
			headers,
			method,
			referrer: headers.get("referer") ?? `https://${domainName}`,
		};

		if (method !== "GET" && method !== "HEAD") {
			const encoding = isBase64Encoded ? "base64" : "utf-8";

			init.body = typeof requestBody === "string" ? Buffer.from(requestBody, encoding) : requestBody;
		}

		const url = new URL(rawPath, init.referrer);

		Object.entries(queryStringParameters).forEach(([key, value]) => {
			url.searchParams.set(key, value);
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

		const response: Response = await app.render(request, routeData);
		const responseHeaders = Object.fromEntries(response.headers.entries());
		const responseContentType = parseContentType(responseHeaders["content-type"]);
		const responseIsBase64Encoded = knownBinaryMediaTypes.has(responseContentType);

		let responseBody: string;

		if (responseIsBase64Encoded) {
			const ab = await response.arrayBuffer();

			responseBody = Buffer.from(ab).toString("base64");
		} else {
			responseBody = await response.text();
		}

		const fnResponse: any = {
			body: responseBody,
			headers: responseHeaders,
			isBase64Encoded: responseIsBase64Encoded,
			statusCode: response.status,
		};

		fnResponse.multiValueHeaders["set-cookie"] = [...app.setCookieHeaders(response)];

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return fnResponse;
	};

	return { handler };
};
