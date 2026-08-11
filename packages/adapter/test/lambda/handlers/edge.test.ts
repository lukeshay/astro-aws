import { beforeEach, describe, expect, test, vi } from "vitest"

const { mockMatch, mockRender, mockSetCookieHeaders } = vi.hoisted(() => ({
	mockMatch: vi.fn(),
	mockRender: vi.fn(),
	mockSetCookieHeaders: vi.fn((): string[] => []),
}))

vi.mock("../../../src/load-runtime-config.js", () => ({
	binaryMediaTypes: [],
	includeRequestIdInLocals: false,
	locals: {},
	logger: undefined,
	mode: "edge",
}))

vi.mock("astro/app/entrypoint", () => ({
	createApp: vi.fn(() => ({
		adapterLogger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
		match: mockMatch,
		render: mockRender,
		setCookieHeaders: mockSetCookieHeaders,
	})),
}))

import { handler } from "../../../src/lambda/handlers/edge.js"

const createMockEvent = () => ({
	Records: [
		{
			cf: {
				config: {
					requestId: "req-001",
				},
				request: {
					clientIp: "203.0.113.20",
					headers: {
						host: [
							{
								key: "Host",
								value: "example.com",
							},
						],
					},
					method: "GET",
					querystring: "",
					uri: "/test",
				},
			},
		},
	],
})

describe("edge", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe("cookies", () => {
		beforeEach(() => {
			mockMatch.mockReturnValue({ route: "/test" })
		})

		test("emits every set-cookie response header as a separate entry", async () => {
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

			expect(result.headers["set-cookie"]).toEqual([
				{ key: "set-cookie", value: "a=1" },
				{ key: "set-cookie", value: "b=2" },
			])
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

		test("emits no set-cookie header when the response sets none", async () => {
			mockRender.mockResolvedValue(
				new Response("OK", {
					headers: { "content-type": "text/html" },
					status: 200,
				}),
			)

			const result = await (handler as Function)(createMockEvent(), {})

			expect(result.headers).not.toHaveProperty("set-cookie")
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

			expect(result.headers["set-cookie"]).toEqual([
				{ key: "set-cookie", value: "a=1" },
			])
		})
	})

	describe("clientAddress", () => {
		test("passes CloudFront client IP to Astro render options", async () => {
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
					clientAddress: "203.0.113.20",
				}),
			)
		})
	})
})
