import type { Writable } from "node:stream"

import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from "aws-lambda"

declare global {
	type ResponseStream = Writable

	type AWSLambda = {
		HttpResponseStream: {
			from: (
				responseStream: ResponseStream,
				metadata: Omit<
					APIGatewayProxyStructuredResultV2,
					"body" | "isBase64Encoded"
				>,
			) => ResponseStream
		}
		streamifyResponse: (
			fn: (
				event: APIGatewayProxyEventV2,
				stream: ResponseStream,
			) => Promise<APIGatewayProxyResultV2 | undefined>,
		) => (event: APIGatewayProxyEventV2) => Promise<void>
	}

	const awslambda: AWSLambda
}
