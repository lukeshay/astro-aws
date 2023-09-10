import type { NodeApp } from "astro/app/node"
import type { APIGatewayProxyEventV2, CloudFrontRequestEvent } from "aws-lambda"

import type { Args } from "../args.js"
import { log } from "../log.js"

import {
	createLambdaEdgeFunctionResponse,
	createLambdaFunctionResponse,
	createRequestBody,
} from "./helpers.js"

export const createHandler =
	(
		app: NodeApp,
		knownBinaryMediaTypes: Set<string>,
		{ logFnResponse, logFnRequest }: Args,
	) =>
	async (originalEvent: APIGatewayProxyEventV2 | CloudFrontRequestEvent) => {
		if (logFnRequest) {
			log("function request", JSON.stringify(originalEvent, undefined, 2))
		}

		if ("Records" in originalEvent) {
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

			if (logFnResponse) {
				log("function response", JSON.stringify(fnResponse, undefined, 2))
			}

			return fnResponse
		}

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
			return {
				body: "Not found",
				statusCode: 404,
			}
		}

		const response = await app.render(request, routeData)
		const fnResponse = await createLambdaFunctionResponse(
			app,
			response,
			knownBinaryMediaTypes,
		)

		if (logFnResponse) {
			log("function response", JSON.stringify(fnResponse, undefined, 2))
		}

		return fnResponse
	}
