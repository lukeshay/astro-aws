import { env } from "node:process"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"
import { type StaticWebsiteStackProps } from "../stacks/website-stack.js"

const base = {
	analyticsReporting: false,
	crossRegionReferences: true,
	env: {
		account: env.AWS_ACCOUNT ?? String(env.CDK_DEFAULT_ACCOUNT),
		region: "us-west-2",
	},
	terminationProtection: false,
}

const Environments = {
	DEV: "DEV",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
} as const

type Environment = (typeof Environments)[keyof typeof Environments]

type EnvironmentProps = AstroAWSStackProps & {
	websites: readonly (Partial<AstroAWSStackProps> &
		StaticWebsiteStackProps & {
			redirectAliases?: [string, ...string[]]
		})[]
}

const ENVIRONMENT_PROPS: Record<Environment, EnvironmentProps> = {
	[Environments.DEV]: {
		...base,
		environment: Environments.DEV,
		websites: [
			{
				alias: "www.static.dev",
				redirectAliases: ["static.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "static",
				app: "apps/docs",
				runtime: "nodejs24",
			},
			{
				alias: "www.ssr.nodejs20.dev",
				redirectAliases: ["ssr.nodejs20.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				app: "examples/base",
				runtime: "nodejs20",
			},
			{
				alias: "www.stream.nodejs20.dev",
				redirectAliases: ["stream.nodejs20.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				app: "examples/base",
				runtime: "nodejs20",
			},
			{
				alias: "www.edge.nodejs20.dev",
				redirectAliases: ["edge.nodejs20.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				app: "examples/base",
				runtime: "nodejs20",
			},
			{
				alias: "www.ssr.nodejs22.dev",
				redirectAliases: ["ssr.nodejs22.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				app: "examples/base",
				runtime: "nodejs22",
			},
			{
				alias: "www.stream.nodejs22.dev",
				redirectAliases: ["stream.nodejs22.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				app: "examples/base",
				runtime: "nodejs22",
			},
			{
				alias: "www.edge.nodejs22.dev",
				redirectAliases: ["edge.nodejs22.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				app: "examples/base",
				runtime: "nodejs22",
			},
			{
				alias: "www.ssr.nodejs24.dev",
				redirectAliases: ["ssr.nodejs24.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				app: "examples/base",
				runtime: "nodejs24",
			},
			{
				alias: "www.stream.nodejs24.dev",
				redirectAliases: ["stream.nodejs24.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				app: "examples/base",
				runtime: "nodejs24",
			},
			{
				alias: "www.edge.nodejs24.dev",
				redirectAliases: ["edge.nodejs24.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				app: "examples/base",
				runtime: "nodejs24",
			},
		],
	},
	[Environments.PROD]: {
		...base,
		environment: Environments.PROD,
		websites: [
			{
				alias: "www",
				hostedZoneName: "astro-aws.org",
				mode: "static",
				app: "apps/docs",
				redirectAliases: ["", "docs", "www.docs"],
				runtime: "nodejs24",
			},
		],
	},
	[Environments.PERSONAL]: {
		...base,
		environment: Environments.PERSONAL,
		websites: [
			{
				mode: "static",
				app: "apps/docs",
				runtime: "nodejs24",
			},
			{
				mode: "ssr",
				app: "examples/base",
				runtime: "nodejs24",
			},
			{
				mode: "ssr-stream",
				app: "examples/base",
				runtime: "nodejs24",
			},
		],
	},
}

export { Environments, ENVIRONMENT_PROPS, type Environment }
