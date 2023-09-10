// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { writeFile } from "node:fs/promises"
import { URL, fileURLToPath } from "node:url"

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { faker } from "@faker-js/faker"
import type { AstroConfig, AstroIntegration, RouteData } from "astro"

import type { Args } from "../args.js"
import { ADAPTER_NAME } from "../constants.js"
import { astroAWSFunctions, getAdapter } from "../index.js"
import { bundleEntry } from "../shared.js"

vi.mock("node:fs/promises")
vi.mock("../shared.js")

describe("index.ts", () => {
	afterEach(() => {
		vi.resetAllMocks()
	})

	describe("getAdapter", () => {
		let args: Args, result: ReturnType<typeof getAdapter>

		beforeEach(() => {
			args = {
				binaryMediaTypes: [faker.datatype.string()],
			}
		})

		describe("when there are arguments", () => {
			beforeEach(() => {
				result = getAdapter(args)
			})

			test("should return the adapter info", () => {
				expect(result).toStrictEqual({
					args,
					exports: ["handler"],
					name: ADAPTER_NAME,
					serverEntrypoint: `${ADAPTER_NAME}/lambda/index.js`,
				})
			})
		})

		describe("when there are **not** arguments", () => {
			beforeEach(() => {
				result = getAdapter()
			})

			test("should return the adapter info", () => {
				expect(result).toStrictEqual({
					args: {},
					exports: ["handler"],
					name: ADAPTER_NAME,
					serverEntrypoint: `${ADAPTER_NAME}/lambda/index.js`,
				})
			})
		})
	})

	describe("astroAWSFunctions", () => {
		let result: AstroIntegration, args: Args

		beforeEach(() => {
			args = {
				binaryMediaTypes: [faker.datatype.string()],
			}
		})

		describe("always", () => {
			beforeEach(() => {
				result = astroAWSFunctions(args)
			})

			test("should return the name and hooks", () => {
				expect(result).toStrictEqual({
					hooks: expect.any(Object),
					name: ADAPTER_NAME,
				})
			})
		})

		describe("hooks", () => {
			let config: AstroConfig,
				routes: RouteData[],
				astroConfigSetup: NonNullable<
					AstroIntegration["hooks"]["astro:config:setup"]
				>,
				astroConfigDone: NonNullable<
					AstroIntegration["hooks"]["astro:config:done"]
				>,
				astroBuildDone: NonNullable<
					AstroIntegration["hooks"]["astro:build:done"]
				>,
				updateConfig: vi.MockedFunction,
				setAdapter: vi.MockedFunction

			beforeEach(() => {
				result = astroAWSFunctions(args)

				const outDir = new URL(`file://${faker.system.directoryPath()}/`)

				config = {
					build: {
						server: new URL("server/", outDir),
						serverEntry: "entry.mjs",
					},
					outDir,
				} as unknown as AstroConfig
				routes = [
					{
						route: faker.datatype.string(),
					} as unknown as RouteData,
					{
						route: faker.datatype.string(),
					} as unknown as RouteData,
					{
						route: faker.datatype.string(),
					} as unknown as RouteData,
				]

				updateConfig = vi.fn()
				setAdapter = vi.fn()

				/* eslint-disable @typescript-eslint/no-non-null-assertion*/
				astroConfigSetup = result.hooks["astro:config:setup"]!
				astroConfigDone = result.hooks["astro:config:done"]!
				astroBuildDone = result.hooks["astro:build:done"]!
				/* eslint-enable @typescript-eslint/no-non-null-assertion*/
			})

			describe("astro:config:setup", () => {
				beforeEach(async () => {
					await astroConfigSetup({
						config,
						updateConfig,
					} as unknown as Parameters<typeof astroConfigSetup>[0])
				})

				test("should call updateConfig", () => {
					expect(updateConfig).toHaveBeenCalledTimes(1)
					expect(updateConfig).toHaveBeenCalledWith({
						build: {
							client: new URL("client/", config.outDir),
							server: new URL("server/", config.outDir),
							serverEntry: "entry.mjs",
						},
					})
				})
			})

			describe("astro:config:done", () => {
				beforeEach(async () => {
					await astroConfigDone({
						config,
						setAdapter,
					} as unknown as Parameters<typeof astroConfigDone>[0])
				})

				test("should call setAdapter", () => {
					expect(setAdapter).toHaveBeenCalledTimes(1)
					expect(setAdapter).toHaveBeenCalledWith(getAdapter(args))
				})
			})

			describe("astro:build:done", () => {
				beforeEach(async () => {
					await astroConfigDone({
						config,
						setAdapter,
					} as unknown as Parameters<typeof astroConfigDone>[0])

					await astroBuildDone({
						routes,
					} as unknown as Parameters<typeof astroBuildDone>[0])
				})

				test("should call writeFile 2 times", () => {
					expect(writeFile).toHaveBeenCalledTimes(2)
				})

				test("should call writeFile with the routes", () => {
					expect(writeFile).toHaveBeenNthCalledWith(
						1,
						fileURLToPath(new URL("routes.json", config.outDir)),
						JSON.stringify(routes, undefined, 2),
					)
				})

				test("should call writeFile with the invalidate paths", () => {
					expect(writeFile).toHaveBeenNthCalledWith(
						2,
						fileURLToPath(new URL("invalidationPaths.json", config.outDir)),
						JSON.stringify(
							routes.map(({ route }) => route),
							undefined,
							2,
						),
					)
				})

				test("should call bundleEntry", () => {
					expect(bundleEntry).toHaveBeenCalledTimes(1)
					expect(bundleEntry).toHaveBeenCalledWith(
						fileURLToPath(
							new URL(config.build.serverEntry, config.build.server),
						),
						fileURLToPath(new URL("lambda", config.outDir)),
						args,
					)
				})
			})
		})
	})
})
