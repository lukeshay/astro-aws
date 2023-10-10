import { env } from "node:process"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"

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
	EDGE: "EDGE",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
	SSR: "SSR",
	STREAM: "STREAM",
} as const

type Environment = (typeof Environments)[keyof typeof Environments]

const ENVIRONMENT_PROPS: Record<Environment, AstroAWSStackProps> = {
	[Environments.DEV]: {
		...base,
		alias: "static.dev",
		environment: Environments.DEV,
		hostedZoneName: "astro-aws.org",
		package: "@astro-aws/docs",
	},
	[Environments.EDGE]: {
		...base,
		alias: "edge.dev",
		distDir: "dist/edge",
		env: {
			...base.env,
			region: "us-east-1",
		},
		environment: Environments.EDGE,
		hostedZoneName: "astro-aws.org",
		package: "@astro-aws/examples-base",
	},
	[Environments.PROD]: {
		...base,
		environment: Environments.PROD,
		hostedZoneName: "astro-aws.org",
		package: "@astro-aws/docs",
	},
	[Environments.PERSONAL]: {
		...base,
		environment: Environments.PERSONAL,
		package: "@astro-aws/docs",
	},
	[Environments.SSR]: {
		...base,
		alias: "ssr.dev",
		distDir: "dist/ssr",
		environment: Environments.SSR,
		hostedZoneName: "astro-aws.org",
		package: "@astro-aws/examples-base",
	},
	[Environments.STREAM]: {
		...base,
		alias: "stream.dev",
		distDir: "dist/ssr-stream",
		environment: Environments.STREAM,
		hostedZoneName: "astro-aws.org",
		package: "@astro-aws/examples-base",
	},
} as const

export { Environments, ENVIRONMENT_PROPS, type Environment }
