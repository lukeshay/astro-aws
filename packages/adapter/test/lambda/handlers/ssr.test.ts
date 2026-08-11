import { beforeEach, describe, expect, test, vi } from "vitest"

const {
	mockMatch,
	mockRender,
	mockSetCookieHeaders,
	mockSetGetEnv,
	runtimeConfig,
} = vi.hoisted(() => ({
	mockMatch: vi.fn(),
	mockRender: vi.fn(),
	mockSetCookieHeaders: vi.fn((): string[] => []),
	mockSetGetEnv: vi.fn(),
	runtimeConfig: {
		binaryMediaTypes: [] as string[],
		includeRequestIdInLocals: false,
		locals: {} as Record<string, unknown>,
		logger: undefined,
		mode: "ssr" as const,
	},
}))

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
		setCookieHeaders: mockSetCookieHeaders,
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
				runtimeConfig.locals = { userId: "user-123" }
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

				expect(localsSnapshots[1]).toEqual({ userId: "user-123" })
			})

			test("**not** mutate configured locals during render", async () => {
				const originalLocals = { role: "admin" }
				runtimeConfig.locals = originalLocals

				mockRender.mockImplementation(
					async (
						_request: unknown,
						options: { locals: Record<string, unknown> },
					) => {
						options.locals.addedByMiddleware = "leaked"
						return new Response("OK", {
							headers: { "content-type": "text/html" },
							status: 200,
						})
					},
				)

				await (handler as Function)(createMockEvent(), {})

				expect(originalLocals).toEqual({ role: "admin" })
			})
		})

		describe("cookies", () => {
			beforeEach(() => {
				mockMatch.mockReturnValue({ route: "/test" })
			})

			test("exposes every set-cookie response header as a separate cookie", async () => {
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: [
							["content-type", "text/html"],
							["set-cookie", "a=1"],
							["set-cookie", "b=2"],
						],
						status: 200,
					}),
				)

				const result = await (handler as Function)(createMockEvent(), {})

				expect(result.cookies).toEqual(["a=1", "b=2"])
			})

			test("renders with addCookieHeader so Astro.cookies are merged into headers", async () => {
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: { "content-type": "text/html" },
						status: 200,
					}),
				)

				await (handler as Function)(createMockEvent(), {})

				expect(mockRender).toHaveBeenCalledWith(
					expect.any(Request),
					expect.objectContaining({ addCookieHeader: true }),
				)
			})

			test("returns no cookies when the response sets none", async () => {
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: { "content-type": "text/html" },
						status: 200,
					}),
				)

				const result = await (handler as Function)(createMockEvent(), {})

				expect(result.cookies).toEqual([])
			})

			test("**not** emit setCookieHeaders cookies a second time", async () => {
				// addCookieHeader: true already merges Astro.cookies into the
				// response headers, so reading setCookieHeaders as well would
				// duplicate every cookie set via Astro.cookies.set().
				mockSetCookieHeaders.mockReturnValueOnce(["sentinel=1"])
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: [
							["content-type", "text/html"],
							["set-cookie", "a=1"],
						],
						status: 200,
					}),
				)

				const result = await (handler as Function)(createMockEvent(), {})

				expect(result.cookies).toEqual(["a=1"])
			})

			test("**not** duplicate cookies into the headers object", async () => {
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: [
							["content-type", "text/html"],
							["set-cookie", "a=1"],
						],
						status: 200,
					}),
				)

				const result = await (handler as Function)(createMockEvent(), {})

				expect(result.headers).not.toHaveProperty("set-cookie")
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

			test("prefers x-forwarded-for over source IP for CloudFront SSR", async () => {
				mockMatch.mockReturnValue({ route: "/test" })
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: { "content-type": "text/html" },
						status: 200,
					}),
				)

				await (handler as Function)(
					{
						...createMockEvent(),
						headers: { "x-forwarded-for": "203.0.113.20" },
					},
					{},
				)

				expect(mockRender).toHaveBeenCalledWith(
					expect.any(Request),
					expect.objectContaining({
						clientAddress: "203.0.113.20",
					}),
				)
			})

			test("uses the leftmost x-forwarded-for address", async () => {
				mockMatch.mockReturnValue({ route: "/test" })
				mockRender.mockResolvedValue(
					new Response("OK", {
						headers: { "content-type": "text/html" },
						status: 200,
					}),
				)

				await (handler as Function)(
					{
						...createMockEvent(),
						headers: {
							"x-forwarded-for": "203.0.113.20, 198.51.100.5, 192.0.2.1",
						},
					},
					{},
				)

				expect(mockRender).toHaveBeenCalledWith(
					expect.any(Request),
					expect.objectContaining({
						clientAddress: "203.0.113.20",
					}),
				)
			})
		})
	})
})
