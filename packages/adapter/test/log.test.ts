import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const importLogModule = () => import("../src/log.js")

describe("log.ts", () => {
	beforeEach(() => {
		delete process.env.ASTRO_AWS_LOG_LEVEL
		vi.resetModules()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test("logs debug messages when ASTRO_AWS_LOG_LEVEL is DEBUG", async () => {
		vi.stubEnv("ASTRO_AWS_LOG_LEVEL", "DEBUG")
		const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})

		const { debug } = await importLogModule()
		debug("message", { value: 1 })

		expect(debugSpy).toHaveBeenCalledTimes(1)
	})

	test("logs info and warnings with default log level", async () => {
		const infoSpy = vi.spyOn(console, "log").mockImplementation(() => {})
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})

		const { log, warn, debug } = await importLogModule()

		log("hello")
		warn("careful")
		debug("hidden")

		expect(infoSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(debugSpy).not.toHaveBeenCalled()
	})

	test("does not log for invalid log level", async () => {
		vi.stubEnv("ASTRO_AWS_LOG_LEVEL", "NOPE")
		const infoSpy = vi.spyOn(console, "log").mockImplementation(() => {})
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})

		const { log, warn, debug } = await importLogModule()

		log("hello")
		warn("careful")
		debug("hidden")

		expect(infoSpy).toHaveBeenCalledTimes(1)
		expect(warnSpy).toHaveBeenCalledTimes(1)
		expect(debugSpy).not.toHaveBeenCalled()
	})

	test("suppresses non-error logs when ASTRO_AWS_LOG_LEVEL is ERROR", async () => {
		vi.stubEnv("ASTRO_AWS_LOG_LEVEL", "ERROR")
		const infoSpy = vi.spyOn(console, "log").mockImplementation(() => {})
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})

		const { log, warn, debug } = await importLogModule()

		log("hello")
		warn("careful")
		debug("hidden")

		expect(infoSpy).not.toHaveBeenCalled()
		expect(warnSpy).not.toHaveBeenCalled()
		expect(debugSpy).not.toHaveBeenCalled()
	})
})
