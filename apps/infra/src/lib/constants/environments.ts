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
			},
			{
				aliases: ["www.ssr.dev", "ssr.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr",
				package: "@astro-aws/examples-base",
			},
			{
				aliases: ["www.stream.dev", "stream.dev"],
				hostedZoneName: "astro-aws.org",
				mode: "ssr-stream",
				package: "@astro-aws/examples-base",
			},
			{
				aliases: ["www.edge.dev", "edge.dev"],
				env: {
					...base.env,
					region: "us-east-1",
				},
				hostedZoneName: "astro-aws.org",
				mode: "edge",
				package: "@astro-aws/examples-base",
			},
		],
	},
	[Environments.PROD]: {
		...base,
		environment: Environments.PROD,
		websites: [
			{
				aliases: ["www", "*"],
				hostedZoneName: "astro-aws.org",
				mode: "static",
				package: "@astro-aws/docs",
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
			},
			{
				mode: "ssr",
				package: "@astro-aws/examples-base",
			},
			{
				mode: "ssr-stream",
				package: "@astro-aws/examples-base",
			},
		],
	},
} as const

export { Environments, ENVIRONMENT_PROPS, type Environment }
