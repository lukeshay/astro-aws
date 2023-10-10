import type { NodeApp } from "astro/app/node"
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	CloudFrontRequestEvent,
} from "aws-lambda"

import type { Args } from "../args.js"

import {
	createLambdaEdgeFunctionResponse,
	createLambdaFunctionHeaders,
	createLambdaFunctionResponse,
	createRequestBody,
} from "./helpers.js"
import { logger } from "./logger.js"

const streamResponse = (
	responseStream: ResponseStream,
	body: ArrayBuffer | string,
	metadata: Omit<APIGatewayProxyStructuredResultV2, "body" | "isBase64Encoded">,
) => {
	const stream = awslambda.HttpResponseStream.from(responseStream, metadata)

	stream.write(body)
	stream.end()

	return stream
}

const withLog =
	<TEvent, TStream, TResult>(
		fn: (event: TEvent, stream: TStream) => Promise<TResult | undefined>,
	) =>
	async (event: TEvent, stream: TStream) => {
		logger.info(event, "fnRequest")

		const result = await fn(event, stream)

		if (result) {
			logger.info(result, "fnResponse")
		}

		return result
	}

const createCloudFrontRequestEvent = (
	app: NodeApp,
	knownBinaryMediaTypes: Set<string>,
) =>
	withLog(async (originalEvent: CloudFrontRequestEvent) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const cloudfrontRequest = originalEvent.Records[0]!.cf.request

		const {
			body,
			headers: eventHeaders,
			querystring,
			uri,
			method,
		} = cloudfrontRequest

		const headers = new Headers(
			Object.fromEntries(
				Object.entries(eventHeaders).map(([key, value]) => [
					value[0]?.key ?? key,
					value[0]?.value,
				]),
			) as HeadersInit,
		)

		const scheme = headers.get("x-forwarded-protocol") ?? "https"
		const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? ""
		const qs = querystring.length ? `?${querystring}` : ""
		const url = new URL(`${uri}${qs}`, `${scheme}://${host}`)

		const request = new Request(url, {
			body: body?.data
				? createRequestBody(method, body.data, body.encoding)
				: undefined,
			headers,
			method,
		})
		const routeData = app.match(request)

		if (!routeData) {
			return cloudfrontRequest
		}

		const response = await app.render(request, routeData)
		const fnResponse = await createLambdaEdgeFunctionResponse(
			app,
			response,
			knownBinaryMediaTypes,
		)

		return fnResponse
	})

const createAPIGatewayProxyEventV2Handler = (
	args: Args,
	app: NodeApp,
	knownBinaryMediaTypes: Set<string>,
) => {
	const shouldStream = args.mode === "ssr-stream"

	const handler = withLog(
		async (
			originalEvent: APIGatewayProxyEventV2,
			responseStream: ResponseStream,
		) => {
			logger.debug("Handling AWS Lambda event")

			const event = originalEvent

			const {
				body: requestBody,
				cookies,
				headers: eventHeaders,
				isBase64Encoded,
				rawQueryString,
				rawPath,
				requestContext: {
					http: { method },
				},
			} = event

			const headers = new Headers({
				...eventHeaders,
				cookie: cookies?.join("; ") ?? "",
			})

			const scheme = eventHeaders["x-forwarded-protocol"] ?? "https"
			const host = eventHeaders["x-forwarded-host"] ?? eventHeaders.host ?? ""
			const qs = rawQueryString.length ? `?${rawQueryString}` : ""
			const url = new URL(`${rawPath}${qs}`, `${scheme}://${host}`)

			const request = new Request(url, {
				body: createRequestBody(method, requestBody, isBase64Encoded),
				headers,
				method,
			})
			const routeData = app.match(request)

			if (!routeData) {
				if (shouldStream) {
					logger.debug("Streaming response")

					const metadata = {
						headers: {
							"content-type": "text/plain",
						},
						statusCode: 404,
					}

					logger.info(metadata, "fnResponse")

					streamResponse(responseStream, "Not found", metadata)

					return
				}

				// eslint-disable-next-line consistent-return
				return {
					body: "Not found",
					statusCode: 404,
				}
			}

			const response = await app.render(request, routeData)

			if (shouldStream) {
				logger.debug("Streaming response")

				const { cookies: responseCookies, headers: responseHeaders } =
					createLambdaFunctionHeaders(app, response, knownBinaryMediaTypes)

				const metadata = {
					cookies: responseCookies,
					headers: responseHeaders,
					statusCode: response.status,
				}

				logger.info(metadata, "fnResponse")

				const body = await response.arrayBuffer()

				streamResponse(responseStream, body, metadata)

				return
			}

			const fnResponse = await createLambdaFunctionResponse(
				app,
				response,
				knownBinaryMediaTypes,
			)

			// eslint-disable-next-line consistent-return
			return fnResponse
		},
	)

	return shouldStream ? awslambda.streamifyResponse(handler) : handler
}

export { createCloudFrontRequestEvent, createAPIGatewayProxyEventV2Handler }
