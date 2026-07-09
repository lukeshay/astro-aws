import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

import type { APIGatewayProxyEventV2, Context } from "aws-lambda"

import { type CloudfrontResult } from "./types.js"

type CloudfrontHandler = (
	event: APIGatewayProxyEventV2,
	context: Context,
) => Promise<CloudfrontResult>

const streamifyResponse = (handler: CloudfrontHandler) =>
	awslambda.streamifyResponse<APIGatewayProxyEventV2>(
		async (event, responseStream, context: Context) => {
			const result = await handler(event, context)

			const metadata = {
				cookies: result.cookies,
				headers: result.headers,
				statusCode: result.statusCode,
			}

			const httpResponseStream = awslambda.HttpResponseStream.from(
				responseStream,
				metadata,
			)

			if (result.body instanceof Readable) {
				await pipeline(result.body, httpResponseStream)
				return
			}

			httpResponseStream.write(result.body)
			httpResponseStream.end()
		},
	)

export { type CloudfrontHandler, streamifyResponse }
