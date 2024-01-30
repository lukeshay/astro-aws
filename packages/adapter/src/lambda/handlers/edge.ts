import { NodeApp } from "astro/app/node"
import type {
	CloudFrontHeaders,
	CloudFrontRequest,
	CloudFrontRequestEvent,
	CloudFrontRequestHandler,
	CloudFrontRequestResult,
	CloudFrontResponseEvent,
	CloudFrontResponseResult,
} from "aws-lambda"
import { type SSRManifest } from "astro"
import { polyfill } from "@astrojs/webapi"

import type { Args } from "../../args.js"
import { createRequestBody, parseContentType } from "../helpers.js"
import {
	DISALLOWED_EDGE_HEADERS,
	KNOWN_BINARY_MEDIA_TYPES,
} from "../constants.js"
import { withLogger } from "../middleware.js"

polyfill(globalThis, {
	exclude: "window document",
})

const createLambdaEdgeFunctionResponse = async (
	app: NodeApp,
	response: Response,
	knownBinaryMediaTypes: Set<string>,
): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
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

const createExports = (
	manifest: SSRManifest,
	args: Args,
): { handler: CloudFrontRequestHandler } => {
	const app = new NodeApp(manifest, false)

	const knownBinaryMediaTypes = new Set([
		...KNOWN_BINARY_MEDIA_TYPES,
		...args.binaryMediaTypes,
	])

	const handleRequest = async (
		request: Request,
		def: CloudFrontRequestResult | CloudFrontResponseResult,
	): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
		const routeData = app.match(request)

		if (!routeData) {
			return def
		}

		const response = await app.render(request, { routeData, locals: args.locals })
		const fnResponse = await createLambdaEdgeFunctionResponse(
			app,
			response,
			knownBinaryMediaTypes,
		)

		return fnResponse
	}

	const handler = async (
		event: CloudFrontRequestEvent | CloudFrontResponseEvent,
	): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const record = event.Records[0]!.cf

		const headers = new Headers(
			Object.fromEntries(
				Object.entries(record.request.headers).map(([key, value]) => [
					value[0]?.key ?? key,
					value[0]?.value,
				]),
			) as HeadersInit,
		)

		const scheme = headers.get("x-forwarded-protocol") ?? "https"
		const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? ""
		const qs = record.request.querystring.length
			? `?${record.request.querystring}`
			: ""

		const requestInit: RequestInit = {
			headers,
			method: record.request.method,
		}

		if ("response" in record) {
			if (record.response.status === "404") {
				const url = new URL(`404${qs}`, `https://${host}`)

				const request = new Request(url, requestInit)

				return handleRequest(request, record.response)
			}

			return record.response
		}

		const cloudFrontRequest = record.request as unknown as CloudFrontRequest

		const url = new URL(
			`${cloudFrontRequest.uri.replace(/\/?index\.html$/u, "")}${qs}`,
			`${scheme}://${host}`,
		)

		requestInit.body = cloudFrontRequest.body?.data
			? createRequestBody(
					cloudFrontRequest.method,
					cloudFrontRequest.body.data,
					cloudFrontRequest.body.encoding,
			  )
			: undefined

		const request = new Request(url, requestInit)

		return handleRequest(request, cloudFrontRequest)
	}

	return {
		handler: withLogger(args.logger, handler),
	}
}

export { createExports }
