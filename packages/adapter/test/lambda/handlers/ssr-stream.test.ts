import { Writable } from "node:stream"

import { beforeEach, describe, expect, test, vi } from "vitest"

const { mockMatch, mockRender, mockSetGetEnv, runtimeConfig } = vi.hoisted(
	() => ({
		mockMatch: vi.fn(),
		mockRender: vi.fn(),
		mockSetGetEnv: vi.fn(),
		runtimeConfig: {
			binaryMediaTypes: [] as string[],
			includeRequestIdInLocals: false,
			locals: {} as Record<string, unknown>,
			logger: undefined,
			mode: "ssr-stream" as const,
		},
	}),
)

const { mockFrom, mockStreamifyResponse } = vi.hoisted(() => {
	const mockFrom = vi.fn(
		(
			responseStream: Writable,
			metadata: {
				statusCode?: number
				headers?: Record<string, string>
				cookies?: string[]
			},
		) => {
			const httpResponseStream = new Writable({
				write(_chunk, _encoding, callback) {
					callback()
				},
			})

			Object.assign(httpResponseStream, { metadata, responseStream })

			return httpResponseStream
		},
	)

	const mockStreamifyResponse = vi.fn(
		(
			handler: (
				event: unknown,
				responseStream: Writable,
				context: unknown,
			) => Promise<void>,
		) =>
			async (event: unknown, context: unknown) => {
				const responseStream = new Writable({
					write(_chunk, _encoding, callback) {
						callback()
					},
				})

				await handler(event, responseStream, context)
			},
	)

	return { mockFrom, mockStreamifyResponse }
})

vi.stubGlobal("awslambda", {
	HttpResponseStream: { from: mockFrom },
	streamifyResponse: mockStreamifyResponse,
})

vi.mock("astro/env/setup", () => ({
	setGetEnv: mockSetGetEnv,
}))

vi.mock("../../../src/load-runtime-config.js", () => ({
	get binaryMediaTypes() {
		return runtimeConfig.binaryMediaTypes
	},
	get includeRequestIdInLocals() {
		return runtimeConfig.includeRequestIdInLocals
	},
	get locals() {
		return runtimeConfig.locals
	},
	get logger() {
		return runtimeConfig.logger
	},
	get mode() {
		return runtimeConfig.mode
	},
}))

vi.mock("astro/app/entrypoint", () => ({
	createApp: vi.fn(() => ({
		adapterLogger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
		manifest: {},
		match: mockMatch,
		render: mockRender,
		setCookieHeaders: () => ["session=abc"],
	})),
}))

const createMockEvent = () => ({
	body: undefined,
	cookies: undefined,
	headers: {},
	isBase64Encoded: false,
	rawPath: "/test",
	rawQueryString: "",
	requestContext: {
		domainName: "example.com",
		http: { method: "GET", sourceIp: "203.0.113.10" },
		requestId: "req-001",
	},
})

describe("ssr-stream", () => {
	beforeEach(async () => {
		vi.clearAllMocks()
		vi.resetModules()
		mockMatch.mockReturnValue({ route: "/test" })
	})

	test("wraps the handler with awslambda.streamifyResponse", async () => {
		const { handler } = await import("../../../src/lambda/handlers/ssr.js")

		expect(mockStreamifyResponse).toHaveBeenCalledOnce()
		expect(handler).toBeTypeOf("function")
	})

	test("streams response metadata and readable body through HttpResponseStream", async () => {
		mockRender.mockResolvedValue(
			new Response("streamed body", {
				headers: { "content-type": "text/html" },
				status: 200,
			}),
		)

		const { handler } = await import("../../../src/lambda/handlers/ssr.js")

		await (handler as Function)(createMockEvent(), {})

		expect(mockFrom).toHaveBeenCalledWith(
			expect.any(Writable),
			expect.objectContaining({
				cookies: ["session=abc"],
				headers: { "content-type": "text/html" },
				statusCode: 200,
			}),
		)
	})

	test("writes string bodies when the handler returns a non-readable body", async () => {
		mockMatch.mockReturnValue(undefined)

		const { handler } = await import("../../../src/lambda/handlers/ssr.js")

		await (handler as Function)(createMockEvent(), {})

		expect(mockFrom).toHaveBeenCalledWith(
			expect.any(Writable),
			expect.objectContaining({
				headers: { "content-type": "text/plain" },
				statusCode: 404,
			}),
		)
	})

	test("enables Astro streaming when mode is ssr-stream", async () => {
		const { createApp } = await import("astro/app/entrypoint")

		await import("../../../src/lambda/handlers/ssr.js")

		expect(createApp).toHaveBeenCalledWith({ streaming: true })
	})
})
