import { Buffer } from "node:buffer";

import type { App } from "astro/app";

export const parseContentType = (header?: string) => header?.split(";")[0] ?? "";

export const createRequestBody = (method: string, requestBody: string | undefined, isBase64Encoded: boolean) => {
	if (method !== "GET" && method !== "HEAD" && requestBody) {
		const encoding = isBase64Encoded ? "base64" : "utf-8";

		return Buffer.from(requestBody, encoding);
	}

	return undefined;
};

export const createFunctionResponse = async (app: App, response: Response, knownBinaryMediaTypes: Set<string>) => {
	const responseHeaders = Object.fromEntries(response.headers.entries());
	const responseContentType = parseContentType(responseHeaders["content-type"]);
	const responseIsBase64Encoded = knownBinaryMediaTypes.has(responseContentType);
	const ab = await response.arrayBuffer();
	const responseBody = Buffer.from(ab).toString(responseIsBase64Encoded ? "base64" : "utf-8");

	return {
		body: responseBody,
		cookies: [...app.setCookieHeaders(response)],
		headers: responseHeaders,
		isBase64Encoded: responseIsBase64Encoded,
		statusCode: response.status,
	};
};
