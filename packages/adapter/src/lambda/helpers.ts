import { Buffer } from "node:buffer";

import type { APIGatewayProxyResultV2 } from "aws-lambda";
import type { App } from "astro/app";
import { DISALLOWED_EDGE_HEADERS } from "./constants";

export const parseContentType = (header?: string) => header?.split(";")[0] ?? "";

export const createRequestBody = (
	method: string,
	requestBody: string | undefined,
	isBase64Encoded: boolean | string,
) => {
	if (method !== "GET" && method !== "HEAD" && requestBody) {
		const encoding =
			typeof isBase64Encoded === "boolean"
				? isBase64Encoded
					? "base64"
					: "utf-8"
				: (isBase64Encoded as BufferEncoding);

		return Buffer.from(requestBody, encoding);
	}

	return undefined;
};

export const createLambdaFunctionResponse = async (
	app: App,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
): Promise<APIGatewayProxyResultV2> => {
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

export const createLambdaEdgeFunctionResponse = async (
	app: App,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
) => {
	app.setCookieHeaders(response);

	const responseHeadersObj = Object.fromEntries(response.headers.entries());

	const responseHeaders = Object.fromEntries(
		Object.entries(responseHeadersObj)
			.filter(([key]) => !DISALLOWED_EDGE_HEADERS.includes(key.toLowerCase()))
			.map(([key, value]) => [key.toLowerCase(), [{ value }]]),
	);
	const responseContentType = parseContentType(responseHeaders["content-type"]?.[0]?.value);
	const responseIsBase64Encoded = knownBinaryMediaTypes.has(responseContentType);
	const encoding = responseIsBase64Encoded ? "base64" : "utf-8";
	const ab = await response.arrayBuffer();
	const responseBody = Buffer.from(ab).toString(encoding);

	return {
		body: responseBody,
		bodyEncoding: responseIsBase64Encoded ? "base64" : "text",
		headers: responseHeaders,
		status: response.status,
	};
};
