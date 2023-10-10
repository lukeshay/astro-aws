import { Buffer } from "node:buffer"

import type {
	APIGatewayProxyResultV2,
	CloudFrontHeaders,
	CloudFrontRequestResult,
} from "aws-lambda"
import type { NodeApp } from "astro/app/node"

import { DISALLOWED_EDGE_HEADERS } from "./constants.js"

const parseContentType = (header?: string | null) => header?.split(";")[0] ?? ""

const createRequestBody = (
	method: string,
	body: string | undefined,
	isBase64Encoded: boolean | string,
) => {
	if (method !== "GET" && method !== "HEAD" && body) {
		const encoding =
			typeof isBase64Encoded === "boolean"
				? isBase64Encoded
					? "base64"
					: "utf-8"
				: (isBase64Encoded as BufferEncoding)

		return encoding === "base64" ? Buffer.from(body, encoding).toString() : body
	}

	return undefined
}

const createLambdaFunctionHeaders = (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
) => {
	const cookies = [...app.setCookieHeaders(response)]

	response.headers.delete("Set-Cookie")

	const headers = Object.fromEntries(response.headers.entries())
	const responseContentType = parseContentType(headers["content-type"])
	const isBase64Encoded = knownBinaryMediaTypes.has(responseContentType)

	return {
		cookies,
		headers,
		isBase64Encoded,
		responseContentType,
	}
}

const createLambdaFunctionResponse = async (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
): Promise<APIGatewayProxyResultV2> => {
	const { cookies, headers, isBase64Encoded } = createLambdaFunctionHeaders(
		app,
		response,
		knownBinaryMediaTypes,
	)
	const body = isBase64Encoded
		? Buffer.from(await response.arrayBuffer()).toString("base64")
		: ((await response.text()) as string)

	return {
		body,
		cookies,
		headers,
		isBase64Encoded,
		statusCode: response.status,
	}
}

const createLambdaEdgeFunctionResponse = async (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
): Promise<CloudFrontRequestResult> => {
	const cookies = [...app.setCookieHeaders(response)]

	const responseHeadersObj = Object.fromEntries(response.headers.entries())

	const headers: CloudFrontHeaders = {
		...Object.fromEntries(
			Object.entries(responseHeadersObj)
				.filter(
					([key]) =>
						!DISALLOWED_EDGE_HEADERS.some((reg) => reg.test(key.toLowerCase())),
				)
				.map(([key, value]) => [
					key.toLowerCase(),
					[
						{
							key,
							value,
						},
					],
				]),
		),
		...(cookies.length > 0 && {
			"set-cookie": cookies.map((cookie) => ({
				key: "set-cookie",
				value: cookie,
			})),
		}),
	}
	const responseContentType = parseContentType(
		response.headers.get("content-type"),
	)
	const bodyEncoding = knownBinaryMediaTypes.has(responseContentType)
		? "base64"
		: "text"

	return {
		body: (await response.text()) as string,
		bodyEncoding,
		headers,
		status: String(response.status),
		statusDescription: response.statusText,
	}
}

export {
	parseContentType,
	createRequestBody,
	createLambdaFunctionResponse,
	createLambdaEdgeFunctionResponse,
	createLambdaFunctionHeaders,
}
