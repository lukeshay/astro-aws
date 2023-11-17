import { URL, fileURLToPath } from "node:url"
import { writeFile } from "node:fs/promises"

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { faker } from "@faker-js/faker"
import type { AstroConfig, AstroIntegration, RouteData } from "astro"

import type { Args } from "../args.js"
import { ADAPTER_NAME } from "../constants.js"
import { astroAWSFunctions, getAdapter } from "../index.js"
import * as shared from "../shared.js"

vi.mock("node:fs/promises", () => ({
	writeFile: vi.fn(),
}))

describe("index.ts", () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	describe("getAdapter", () => {
		const args: Args = {
			binaryMediaTypes: [faker.string.sample()],
			esBuildOptions: {},
			locals: {},
			mode: "ssr",
		}

		describe("when there are arguments", () => {
			test("should return the adapter info", () => {
				const result = getAdapter(args)

				expect(result).toStrictEqual({
					adapterFeatures: {
						edgeMiddleware: false,
						functionPerRoute: false,
					},
					args: {
						...args,
						esBuildOptions: {},
						locals: {},
						mode: "ssr",
					},
					exports: ["handler"],
					name: ADAPTER_NAME,
					serverEntrypoint: `${ADAPTER_NAME}/lambda/handlers/ssr.js`,
					supportedAstroFeatures: {
						assets: {
							isSharpCompatible: false,
							isSquooshCompatible: false,
							supportKind: "stable",
						},
						hybridOutput: "stable",
						serverOutput: "stable",
						staticOutput: "unsupported",
					},
				})
			})
		})

		describe("when there are **not** arguments", () => {
			test("should return the adapter info", () => {
				const result = getAdapter()

				expect(result).toStrictEqual({
					adapterFeatures: {
						edgeMiddleware: false,
						functionPerRoute: false,
					},
					args: {
						binaryMediaTypes: [],
						esBuildOptions: {},
						locals: {},
						mode: "ssr",
					},
					exports: ["handler"],
					name: ADAPTER_NAME,
					serverEntrypoint: `${ADAPTER_NAME}/lambda/handlers/ssr.js`,
					supportedAstroFeatures: {
						assets: {
							isSharpCompatible: false,
							isSquooshCompatible: false,
							supportKind: "stable",
						},
						hybridOutput: "stable",
						serverOutput: "stable",
						staticOutput: "unsupported",
					},
				})
			})
		})
	})

	describe("astroAWSFunctions", () => {
		const args: Args = {
			binaryMediaTypes: [faker.string.sample()],
		}

		describe("always", () => {
			test("should return the name and hooks", () => {
				const result = astroAWSFunctions(args)

				expect(result).toStrictEqual({
					hooks: expect.any(Object),
					name: ADAPTER_NAME,
				})
			})
		})

		describe("hooks", () => {
			let config: AstroConfig,
				result: AstroIntegration,
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

				const outDir = new URL(`file:///dev/null/`)

				config = {
					build: {
						server: new URL("server/", outDir),
						serverEntry: "entry.mjs",
					},
					outDir,
				} as unknown as AstroConfig
				routes = [
					{
						route: faker.string.sample(),
					} as unknown as RouteData,
					{
						route: faker.string.sample(),
					} as unknown as RouteData,
					{
						route: faker.string.sample(),
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
				test("should call updateConfig", async () => {
					await astroConfigSetup({
						config,
						updateConfig,
					} as unknown as Parameters<typeof astroConfigSetup>[0])

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
				test("should call setAdapter", async () => {
					await astroConfigDone({
						config,
						setAdapter,
					} as unknown as Parameters<typeof astroConfigDone>[0])

					expect(setAdapter).toHaveBeenCalledTimes(1)
					expect(setAdapter).toHaveBeenCalledWith(getAdapter(args))
				})
			})

			describe("astro:build:done", () => {
				test("should bundle entry", async () => {
					const bundleEntry = vi
						.spyOn(shared, "bundleEntry")
						.mockResolvedValue()

					await astroConfigDone({
						config,
						setAdapter,
					} as unknown as Parameters<typeof astroConfigDone>[0])

					await astroBuildDone({
						routes,
					} as unknown as Parameters<typeof astroBuildDone>[0])

					expect(writeFile).toHaveBeenCalledTimes(1)
					expect(writeFile).toHaveBeenCalledWith(
						fileURLToPath(new URL("metadata.json", config.outDir)),
						expect.any(String),
					)
					expect(bundleEntry).toHaveBeenCalledTimes(1)
					expect(bundleEntry).toHaveBeenCalledWith(
						fileURLToPath(
							new URL(config.build.serverEntry, config.build.server),
						),
						fileURLToPath(new URL("lambda", config.outDir)),
						{
							...args,
							esBuildOptions: {},
							locals: {},
							mode: "ssr",
						},
					)
				})
			})
		})
	})
})
