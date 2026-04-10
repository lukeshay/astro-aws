import { beforeEach, describe, expect, test, vi } from "vitest"

const mockRender = vi.fn()
const mockMatch = vi.fn()

vi.mock("astro/app/node", () => ({
	NodeApp: class {
		getAdapterLogger = () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() })
		match = mockMatch
		render = mockRender
		setCookieHeaders = () => []
	},
}))

const { createExports } = await import("../../../src/lambda/handlers/ssr.js")

type SSRManifest = Parameters<typeof createExports>[0]

const createMockEvent = () => ({
	body: undefined,
	cookies: undefined,
	headers: {},
	isBase64Encoded: false,
	rawPath: "/test",
	rawQueryString: "",
	requestContext: {
		domainName: "example.com",
		http: { method: "GET" },
		requestId: "req-001",
	},
})

describe("SSR Handler - locals persistence bug", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockMatch.mockReturnValue({ route: "/test" })
	})

	test("locals should not leak state between handler invocations", async () => {
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

		const { handler } = createExports({} as SSRManifest, {
			locals: { userId: "user-123" },
			mode: "ssr",
		})

		const event = createMockEvent()

		await (handler as Function)(event, {})
		await (handler as Function)(event, {})

		expect(localsSnapshots[1]).toEqual({ userId: "user-123" })
	})

	test("original args.locals object should not be mutated by render", async () => {
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

		const originalLocals = { role: "admin" }
		const { handler } = createExports({} as SSRManifest, {
			locals: originalLocals,
			mode: "ssr",
		})

		await (handler as Function)(createMockEvent(), {})

		expect(originalLocals).toEqual({ role: "admin" })
	})
})
