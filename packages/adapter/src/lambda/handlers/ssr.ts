import { Buffer } from "node:buffer"

import { NodeApp } from "astro/app/node"
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyHandlerV2,
} from "aws-lambda"
import middy, { MiddyfiedHandler } from "@middy/core"
import { type SSRManifest } from "astro"
import { polyfill } from "@astrojs/webapi"

import type { Args } from "../../args.js"
import {
	createReadableStream,
	createRequestBody,
	parseContentType,
} from "../helpers.js"
import { withLogger } from "../middleware.js"
import { KNOWN_BINARY_MEDIA_TYPES } from "../constants.js"
import { type CloudfrontResult } from "../types.js"

polyfill(globalThis, {
	exclude: "window document",
})

const createLambdaFunctionHeaders = (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
) => {
	const cookies = [...app.setCookieHeaders(response)]
	const intermediateHeaders = new Headers(response.headers)

	intermediateHeaders.delete("set-cookie")

	const headers = Object.fromEntries(intermediateHeaders.entries())
	const responseContentType = parseContentType(headers["content-type"])
	const isBase64Encoded = knownBinaryMediaTypes.has(responseContentType)

	return {
		cookies,
		headers,
		isBase64Encoded,
		responseContentType,
	}
}

const createAPIGatewayProxyEventV2ResponseBody = async (
	response: Response,
	shouldStream: boolean,
	isBase64Encoded: boolean,
) => {
	if (shouldStream) {
		return createReadableStream(await response.arrayBuffer())
	}

	return isBase64Encoded
		? Buffer.from(await response.arrayBuffer()).toString("base64")
		: ((await response.text()) as string)
}

const createLambdaFunctionResponse = async (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
	shouldStream: boolean,
): Promise<CloudfrontResult> => {
	const { cookies, headers, isBase64Encoded } = createLambdaFunctionHeaders(
		app,
		response,
		knownBinaryMediaTypes,
	)

	const body = await createAPIGatewayProxyEventV2ResponseBody(
		response,
		shouldStream,
		isBase64Encoded,
	)

	return {
		body,
		cookies,
		headers,
		isBase64Encoded,
		statusCode: response.status,
	}
}

const createExports = (
	manifest: SSRManifest,
	args: Args,
): { handler: APIGatewayProxyHandlerV2<CloudfrontResult> } => {
	const shouldStream = args.mode === "ssr-stream"

	const app = new NodeApp(manifest, shouldStream)

	const knownBinaryMediaTypes = new Set([
		...KNOWN_BINARY_MEDIA_TYPES,
		...args.binaryMediaTypes,
	])

	const handler: APIGatewayProxyHandlerV2<CloudfrontResult> = async (
		event: APIGatewayProxyEventV2,
	) => {
		const headers = new Headers()

		for (const [k, v] of Object.entries(event.headers)) {
			if (v) headers.set(k, v)
		}

		if (event.cookies) {
			headers.set("cookie", event.cookies.join("; "))
		}

		const qs = event.rawQueryString.length ? `?${event.rawQueryString}` : ""
		const url = new URL(
			`${event.rawPath.replace(/\/?index\.html$/u, "")}${qs}`,
			`https://${event.requestContext.domainName}`,
		)

		const request = new Request(url, {
			body: createRequestBody(
				event.requestContext.http.method,
				event.body,
				event.isBase64Encoded,
			),
			headers,
			method: event.requestContext.http.method,
		})

		let routeData = app.match(request)

		if (!routeData) {
			const request404 = new Request(
				new URL(`404${qs}`, `https://${event.requestContext.domainName}`),
				{
					body: createRequestBody(
						event.requestContext.http.method,
						event.body,
						event.isBase64Encoded,
					),
					headers,
					method: event.requestContext.http.method,
				},
			)

			routeData = app.match(request404)

			if (!routeData) {
				return {
					body: shouldStream ? createReadableStream("Not found") : "Not found",
					headers: {
						"content-type": "text/plain",
					},
					statusCode: 404,
				}
			}
		}

		const response = await app.render(request, {
			locals: args.locals,
			routeData,
		})

		return createLambdaFunctionResponse(
			app,
			response,
			knownBinaryMediaTypes,
			shouldStream,
		)
	}

	return {
		handler: middy({ streamifyResponse: shouldStream }).handler(
			withLogger(args.logger, handler) as MiddyfiedHandler,
		),
	}
}

export { createExports }
