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
	READ_ONLY_ORIGIN_REQUEST_HEADERS,
	KNOWN_BINARY_MEDIA_TYPES,
} from "../constants.js"
import { withLogger } from "../middleware.js"

polyfill(globalThis, {
	exclude: "window document",
})
const createExports = (
	manifest: SSRManifest,
	args: Args,
): { handler: CloudFrontRequestHandler } => {
	const app = new NodeApp(manifest, false)

	const logger = app.getAdapterLogger()

	const knownBinaryMediaTypes = new Set([
		...KNOWN_BINARY_MEDIA_TYPES,
		...args.binaryMediaTypes,
	])

	const createLambdaEdgeFunctionResponse = async (
		response: Response,
		knownBinaryMediaTypes: Set<string>,
		readOnlyHeaders: Array<RegExp>,
	): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
		const cookies = [...app.setCookieHeaders(response)]

		const responseHeadersObj = Object.fromEntries(response.headers.entries())

		const headers: CloudFrontHeaders = {
			...Object.fromEntries(
				Object.entries(responseHeadersObj)
					.filter(
						([key]) =>
							!readOnlyHeaders.some((reg) => reg.test(key.toLowerCase())),
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

	const handleRequest = async (
		request: Request,
		def: CloudFrontRequestResult | CloudFrontResponseResult,
		requestId: string,
		readOnlyHeaders: Array<RegExp>,
	): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
		const routeData = app.match(request)

		if (!routeData) {
			return def
		}

		let locals = args.locals || {}
		if (args.includeRequestIdInLocals) {
			locals = {
				...locals,
				requestId,
			}
		}
		const response = await app.render(request, {
			locals,
			routeData,
		})

		const fnResponse = await createLambdaEdgeFunctionResponse(
			response,
			knownBinaryMediaTypes,
			readOnlyHeaders,
		)

		return fnResponse
	}

	const handler = async (
		event: CloudFrontRequestEvent | CloudFrontResponseEvent,
	): Promise<CloudFrontRequestResult | CloudFrontResponseResult> => {
		const record = event.Records[0]!.cf
		const requestId = record.config.requestId

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

		const cloudFrontRequest = record.request as unknown as CloudFrontRequest

		const requestInit: RequestInit = {
			headers,
			method: cloudFrontRequest.method,
			body: cloudFrontRequest.body?.data
				? createRequestBody(
						cloudFrontRequest.method,
						cloudFrontRequest.body.data,
						cloudFrontRequest.body.encoding,
					)
				: undefined,
		}

		const url = new URL(
			`${cloudFrontRequest.uri.replace(/\/?index\.html$/u, "")}${qs}`,
			`${scheme}://${host}`,
		)

		logger.info(
			`Scheme: ${scheme}, Host: ${host}, Query String: ${qs}, URL: ${url.toString()}`,
		)

		if ("response" in record) {
			logger.info(
				`Handling origin response with status: ${record.response.status}`,
			)

			if (Number(record.response.status) > 399) {
				record.response.status = "302"
				record.response.statusDescription = "Found"
				// @ts-expect-error - TS doesn't like this but it is valid
				record.response.body = ""
				record.response.headers["location"] = [
					{ key: "Location", value: `/404${qs}` },
				]
			}

			return record.response
		}

		logger.info(`Handling origin request`)

		const request = new Request(url, requestInit)

		return handleRequest(
			request,
			cloudFrontRequest,
			requestId,
			READ_ONLY_ORIGIN_REQUEST_HEADERS,
		)
	}

	return {
		handler: withLogger(args.logger, handler),
	}
}

export { createExports }
