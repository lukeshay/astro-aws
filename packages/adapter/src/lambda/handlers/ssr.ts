import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"

import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyHandlerV2,
} from "aws-lambda"
import middy, { MiddyfiedHandler } from "@middy/core"
import { polyfill } from "@astrojs/webapi"
import { setGetEnv } from "astro/env/setup"
import { createApp } from "astro/app/entrypoint"

import {
	createReadableStream,
	createRequestBody,
	getClientAddress,
	parseContentType,
	validateURL,
} from "../helpers.js"
import { withLogger } from "../middleware.js"
import { KNOWN_BINARY_MEDIA_TYPES } from "../constants.js"
import { type CloudfrontResult } from "../types.js"
import {
	binaryMediaTypes,
	includeRequestIdInLocals,
	locals as configuredLocals,
	logger as loggerOptions,
	mode,
} from "../../load-runtime-config.js"

polyfill(globalThis, {
	exclude: "window document",
})

setGetEnv((key) => process.env[key])

const originalFetch = globalThis.fetch.bind(globalThis)

const contentTypeFromPath = (pathname: string) => {
	if (pathname.endsWith(".avif")) return "image/avif"
	if (pathname.endsWith(".gif")) return "image/gif"
	if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
		return "image/jpeg"
	}
	if (pathname.endsWith(".png")) return "image/png"
	if (pathname.endsWith(".svg")) return "image/svg+xml"
	if (pathname.endsWith(".webp")) return "image/webp"

	return "application/octet-stream"
}

globalThis.fetch = async (input, init) => {
	const inputUrl =
		typeof input === "string"
			? new URL(input, "http://localhost")
			: input instanceof URL
				? input
				: new URL(input.url, "http://localhost")

	if (inputUrl.pathname.startsWith("/_astro/")) {
		if (inputUrl.pathname.includes("..")) {
			return new Response("Forbidden", { status: 403 })
		}

		try {
			const localAssetUrl = new URL(
				`./client${inputUrl.pathname}`,
				import.meta.url,
			)
			const localAsset = await readFile(localAssetUrl)

			return new Response(localAsset, {
				headers: {
					"content-type": contentTypeFromPath(inputUrl.pathname),
				},
				status: 200,
			})
		} catch {
			// Fallback to default fetch behavior when the local asset does not exist.
		}
	}

	return originalFetch(input, init)
}

const isAsciiStringPattern = /^[\x00-\xFF]*$/
const shouldStream = mode === "ssr-stream"

const app = createApp({
	streaming: shouldStream,
})
app.manifest = {
	...app.manifest,
	buildClientDir: new URL("./client/", import.meta.url),
}

const adapterLogger = app.adapterLogger

const knownBinaryMediaTypes = new Set([
	...KNOWN_BINARY_MEDIA_TYPES,
	...(binaryMediaTypes ?? []),
])

const createLambdaFunctionHeaders = (
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
	response: Response,
	knownBinaryMediaTypes: Set<string>,
	shouldStream: boolean,
): Promise<CloudfrontResult> => {
	const { cookies, headers, isBase64Encoded } = createLambdaFunctionHeaders(
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

const getDomainName = (
	headers: Headers,
	fallbackDomainName: string,
	rawPath: string,
) => {
	const forwardedHost = headers.get("x-forwarded-host")

	if (forwardedHost) {
		return forwardedHost
	}

	if (rawPath.startsWith("/_image")) {
		const referer = headers.get("referer")

		if (referer) {
			try {
				return new URL(referer).host
			} catch {
				// ignore invalid referer
			}
		}
	}

	return fallbackDomainName
}

const lambdaHandler: APIGatewayProxyHandlerV2<CloudfrontResult> = async (
	event: APIGatewayProxyEventV2,
) => {
	const headers = new Headers()

	for (const [k, v] of Object.entries(event.headers)) {
		if (!v) continue
		try {
			headers.set(k, v)
		} catch (err) {
			adapterLogger.warn(
				`Could not set header "${k}" with value "${v}". Skipping. ${JSON.stringify(err)}`,
			)
		}
	}

	if (event.cookies) {
		headers.set(
			"cookie",
			event.cookies
				.filter((cookie) => cookie && isAsciiStringPattern.test(cookie))
				.join("; "),
		)
	}

	const requestId = event.requestContext.requestId
	const domainName = getDomainName(
		headers,
		event.requestContext.domainName,
		event.rawPath,
	)
	const qs = event.rawQueryString.length ? `?${event.rawQueryString}` : ""

	let url: URL
	try {
		url = new URL(
			`${event.rawPath.replace(/\/?index\.html$/u, "")}${qs}`,
			`https://${domainName}`,
		)
		validateURL(url)
	} catch {
		const response400 = new Response("Bad Request", { status: 400 })
		return createLambdaFunctionResponse(
			response400,
			knownBinaryMediaTypes,
			shouldStream,
		)
	}

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
			new URL(`404${qs}`, `https://${domainName}`),
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

	let locals = structuredClone(configuredLocals || {})
	if (includeRequestIdInLocals && requestId) {
		locals = {
			...locals,
			requestId,
		}
	}
	const response = await app.render(request, {
		clientAddress: getClientAddress(
			headers,
			event.requestContext.http.sourceIp,
		),
		locals,
		routeData,
	})

	return createLambdaFunctionResponse(
		response,
		knownBinaryMediaTypes,
		shouldStream,
	)
}

const handler = middy({ streamifyResponse: shouldStream }).handler(
	withLogger(adapterLogger, loggerOptions, lambdaHandler) as MiddyfiedHandler,
)

export { handler }
