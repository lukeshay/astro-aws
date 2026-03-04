import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { App, Stack } from "aws-cdk-lib"
import { Match, Template } from "aws-cdk-lib/assertions"
import { stringify } from "flatted"
import { afterEach, describe, expect, it } from "vitest"

import { AstroAWS } from "../index.js"

const tempDirs: string[] = []

const createDist = (metadata?: { mode: "ssr" | "ssr-stream" | "edge" }) => {
	const root = join(
		tmpdir(),
		`astro-aws-constructs-${Math.random().toString(16).slice(2)}`,
	)
	const distDir = join(root, "dist")
	mkdirSync(distDir, { recursive: true })

	if (metadata) {
		mkdirSync(join(distDir, "lambda"), { recursive: true })
		mkdirSync(join(distDir, "client"), { recursive: true })
		writeFileSync(
			join(distDir, "metadata.json"),
			stringify({
				args: {
					binaryMediaTypes: ["image/*"],
					esBuildOptions: {},
					mode: metadata.mode,
				},
				config: {
					output: "server",
				},
			}),
		)
	}

	writeFileSync(join(distDir, "index.html"), "<html></html>")
	tempDirs.push(root)
	return root
}

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		rmSync(dir, { force: true, recursive: true })
	}
})

describe("AstroAWS", () => {
	it("creates static resources without SSR lambda function", () => {
		const app = new App()
		const stack = new Stack(app, "StaticStack")
		const websiteDir = createDist()

		const astro = new AstroAWS(stack, "Astro", { websiteDir })
		const template = Template.fromStack(stack)

		expect(astro.isStatic).toBe(true)
		expect(astro.cdk.lambdaFunction).toBeUndefined()
		template.resourceCountIs("AWS::CloudFront::Distribution", 1)
		template.resourceCountIs("AWS::Lambda::Url", 0)
	})

	it("creates ssr lambda and configures origin group", () => {
		const app = new App()
		const stack = new Stack(app, "SSRStack")
		const websiteDir = createDist({ mode: "ssr" })

		const astro = new AstroAWS(stack, "Astro", {
			websiteDir,
			cdk: {
				lambdaFunction: {
					environment: {
						FOO: "bar",
					},
				},
				originGroup: {
					fallbackStatusCodes: [418],
				},
			},
		})

		const template = Template.fromStack(stack)
		expect(astro.isSSR).toBe(true)
		expect(astro.cdk.originGroup).toBeDefined()
		expect(astro.cdk.lambdaFunctionUrl).toBeDefined()

		template.hasResourceProperties("AWS::Lambda::Function", {
			Handler: "entry.handler",
			MemorySize: 512,
			Runtime: "nodejs24.x",
			Environment: {
				Variables: {
					FOO: "bar",
				},
			},
		})
		template.hasResourceProperties("AWS::Lambda::Url", {
			AuthType: "NONE",
			InvokeMode: "BUFFERED",
		})
		template.hasResourceProperties("AWS::CloudFront::Distribution", {
			DistributionConfig: {
				OriginGroups: {
					Quantity: 1,
					Items: [
						Match.objectLike({
							FailoverCriteria: {
								StatusCodes: {
									Items: Match.arrayWith([404, 418]),
								},
							},
						}),
					],
				},
			},
		})
	})

	it("uses streaming invoke mode for ssr-stream", () => {
		const app = new App()
		const stack = new Stack(app, "StreamStack")
		const websiteDir = createDist({ mode: "ssr-stream" })

		new AstroAWS(stack, "Astro", { websiteDir })
		const template = Template.fromStack(stack)

		template.hasResourceProperties("AWS::Lambda::Url", {
			InvokeMode: "RESPONSE_STREAM",
		})
	})

	it("uses edge lambda associations and x86_64 architecture in edge mode", () => {
		const app = new App()
		const stack = new Stack(app, "EdgeStack")
		const websiteDir = createDist({ mode: "edge" })

		const astro = new AstroAWS(stack, "Astro", { websiteDir })
		const template = Template.fromStack(stack)

		expect(astro.cdk.originGroup).toBeUndefined()
		template.hasResourceProperties("AWS::Lambda::Function", {
			Architectures: ["x86_64"],
		})
		template.hasResourceProperties("AWS::CloudFront::Distribution", {
			DistributionConfig: {
				CacheBehaviors: Match.arrayWith([
					Match.objectLike({ PathPattern: "/api/*" }),
				]),
				DefaultCacheBehavior: Match.objectLike({
					LambdaFunctionAssociations: Match.arrayWith([
						Match.objectLike({ EventType: "origin-request" }),
						Match.objectLike({ EventType: "origin-response" }),
					]),
				}),
			},
		})
	})
})
