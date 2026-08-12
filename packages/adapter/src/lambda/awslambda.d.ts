import type { Writable } from "node:stream"

import type { Context } from "aws-lambda"

declare const awslambda: {
	HttpResponseStream: {
		from(
			responseStream: Writable,
			metadata: {
				statusCode?: number
				headers?: Record<string, string | number | boolean>
				cookies?: string[]
			},
		): Writable
	}
	streamifyResponse<TEvent>(
		handler: (
			event: TEvent,
			responseStream: Writable,
			context: Context,
		) => Promise<void> | void,
	): (event: TEvent, context: Context) => Promise<void>
}
