import { type Readable } from "node:stream"

import { type APIGatewayProxyStructuredResultV2 } from "aws-lambda"

export type CloudfrontResult = Omit<
	APIGatewayProxyStructuredResultV2,
	"body"
> & {
	body: Readable | string
}
