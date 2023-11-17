import { Buffer } from "node:buffer"
import { Readable } from "node:stream"

const createReadableStream = (val: ArrayBuffer | string): Readable =>
	new Readable({
		// eslint-disable-next-line get-off-my-lawn/prefer-arrow-functions
		read() {
			// @ts-expect-error - TS doesn't like this but it is valid
			this.push(Buffer.from(val))
			// eslint-disable-next-line unicorn/no-null
			this.push(null)
		},
	})

const parseContentType = (header?: string | null) => header?.split(";")[0] ?? ""

const createRequestBody = (
	method: string,
	body: string | undefined,
	isBase64Encoded: boolean | string,
) => {
	if (method !== "GET" && method !== "HEAD" && body) {
		return body && isBase64Encoded ? Buffer.from(body, "base64") : body
	}

	return undefined
}

export { parseContentType, createRequestBody, createReadableStream }
