import { type Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

import type { APIGatewayProxyEventV2, Context } from "aws-lambda"

import { type CloudfrontResult } from "./types.js"

/** Streaming handlers must return a Readable body; string bodies are not supported. */
type CloudfrontStreamingResult = Omit<CloudfrontResult, "body"> & {
	body: Readable
}

type CloudfrontHandler = (
	event: APIGatewayProxyEventV2,
	context: Context,
) => Promise<CloudfrontStreamingResult>

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

			// HttpResponseStream only flushes the metadata frame on the first
			// write. Empty bodies (redirects, 204) emit no chunks through
			// pipeline, so force a prelude write before ending.
			httpResponseStream.write("")

			await pipeline(result.body, httpResponseStream)
		},
	)

export { type CloudfrontHandler, streamifyResponse }
