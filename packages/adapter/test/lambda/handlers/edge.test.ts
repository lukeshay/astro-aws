import { beforeEach, describe, expect, test, vi } from "vitest"

const { mockMatch, mockRender } = vi.hoisted(() => ({
	mockMatch: vi.fn(),
	mockRender: vi.fn(),
}))

vi.mock("astro/app/entrypoint", () => ({
	createApp: vi.fn(() => ({
		adapterLogger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
		match: mockMatch,
		render: mockRender,
		setCookieHeaders: () => [],
	})),
}))

import { createExports } from "../../../src/lambda/handlers/edge.js"

type EdgeManifest = Parameters<typeof createExports>[0]

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

	describe("clientAddress", () => {
		test("passes CloudFront client IP to Astro render options", async () => {
			mockMatch.mockReturnValue({ route: "/test" })
			mockRender.mockResolvedValue(
				new Response("OK", {
					headers: { "content-type": "text/html" },
					status: 200,
				}),
			)

			const { handler } = createExports({} as EdgeManifest, {
				mode: "edge",
			})

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
