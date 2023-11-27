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

type EnvironmentProps = Readonly<
	AstroAWSStackProps & {
		websites: readonly (Partial<AstroAWSStackProps> & StaticWebsiteStackProps)[]
	}
>

const ENVIRONMENT_PROPS: Record<Environment, EnvironmentProps> = {
	[Environments.DEV]: {
		...base,
		environment: Environments.DEV,
		websites: [
			{
				aliases: ["www.static.dev", "static.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "static",
				package: "@astro-aws/docs",
				runtime: "nodejs20",
			},
			{
				aliases: ["www.ssr.nodejs18.dev", "ssr.nodejs18.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				package: "@astro-aws/examples-base",
				runtime: "nodejs18",
			},
			{
				aliases: ["www.stream.nodejs18.dev", "stream.nodejs18.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				package: "@astro-aws/examples-base",
				runtime: "nodejs18",
			},
			{
				aliases: ["www.edge.nodejs18.dev", "edge.nodejs18.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				package: "@astro-aws/examples-base",
				runtime: "nodejs18",
			},
			{
				aliases: ["www.ssr.nodejs20.dev", "ssr.nodejs20.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				package: "@astro-aws/examples-base",
				runtime: "nodejs20",
			},
			{
				aliases: ["www.stream.nodejs20.dev", "stream.nodejs20.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				package: "@astro-aws/examples-base",
				runtime: "nodejs20",
			},
			{
				aliases: ["www.edge.nodejs20.dev", "edge.nodejs20.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				package: "@astro-aws/examples-base",
				runtime: "nodejs20",
			},
		],
	},
	[Environments.PROD]: {
		...base,
		environment: Environments.PROD,
		websites: [
			{
				aliases: ["www.docs", "docs"],
				hostedZoneName: "astro-aws.org",
				mode: "static",
				package: "@astro-aws/docs",
				runtime: "nodejs20",
			},
		],
	},
	[Environments.PERSONAL]: {
		...base,
		environment: Environments.PERSONAL,
		websites: [
			{
				mode: "static",
				package: "@astro-aws/docs",
				runtime: "nodejs20",
			},
			{
				mode: "ssr",
				package: "@astro-aws/examples-base",
				runtime: "nodejs20",
			},
			{
				mode: "ssr-stream",
				package: "@astro-aws/examples-base",
				runtime: "nodejs20",
			},
		],
	},
} as const

export { Environments, ENVIRONMENT_PROPS, type Environment }
