import { beforeEach, describe, expect, test, vi } from "vitest"

const { mockMatch, mockRender, mockSetGetEnv } = vi.hoisted(() => ({
	mockMatch: vi.fn(),
	mockRender: vi.fn(),
	mockSetGetEnv: vi.fn(),
}))

vi.mock("astro/env/setup", () => ({
	setGetEnv: mockSetGetEnv,
}))

vi.mock("../../../src/load-runtime-config.js", () => ({
	binaryMediaTypes: [],
	includeRequestIdInLocals: false,
	locals: {},
	logger: undefined,
	mode: "ssr",
}))

vi.mock("astro/app/entrypoint", () => ({
	createApp: vi.fn(() => ({
		adapterLogger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
		manifest: {},
		match: mockMatch,
		render: mockRender,
		setCookieHeaders: () => [],
	})),
}))

import { handler } from "../../../src/lambda/handlers/ssr.js"

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

describe("ssr", () => {
	describe("envGetSecret", () => {
		test("registers process.env lookup for Astro secrets", () => {
			expect(mockSetGetEnv).toHaveBeenCalledWith(expect.any(Function))
			const getEnv = mockSetGetEnv.mock.calls[0]![0] as (key: string) => string
			process.env.TEST_FIXTURE_SECRET = "fixture-value"
			expect(getEnv("TEST_FIXTURE_SECRET")).toBe("fixture-value")
			delete process.env.TEST_FIXTURE_SECRET
		})
	})

	describe("handler behavior", () => {
		beforeEach(() => {
			vi.clearAllMocks()
		})

		describe("locals", () => {
			beforeEach(() => {
				mockMatch.mockReturnValue({ route: "/test" })
			})

			test("**not** leak state between handler invocations", async () => {
				const localsSnapshots: Record<string, unknown>[] = []

				mockRender.mockImplementation(
					async (
						_request: unknown,
						options: { locals: Record<string, unknown> },
					) => {
						localsSnapshots.push({ ...options.locals })
						options.locals.addedByMiddleware = "leaked"
						return new Response("OK", {
							headers: { "content-type": "text/html" },
							status: 200,
						})
					},
				)

				const event = createMockEvent()

				await (handler as Function)(event, {})
				await (handler as Function)(event, {})

				expect(localsSnapshots[1]).toEqual({})
			})
		})

		describe("clientAddress", () => {
			test("passes API Gateway source IP to Astro render options", async () => {
				mockMatch.mockReturnValue({ route: "/test" })
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: { "content-type": "text/html" },
						status: 200,
					}),
				)

				await (handler as Function)(createMockEvent(), {})

				expect(mockRender).toHaveBeenCalledWith(
					expect.any(Request),
					expect.objectContaining({
						clientAddress: "203.0.113.10",
					}),
				)
			})
		})
	})
})
