import { env } from "node:process";

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js";

const base = {
	analyticsReporting: false,
	crossRegionReferences: true,
	env: {
		account: env.AWS_ACCOUNT ?? String(env.CDK_DEFAULT_ACCOUNT),
		region: "us-west-2",
	},
	terminationProtection: false,
};

const Environments = {
	DEV: "DEV",
	DEV_NODE_16: "NODE16",
	DEV_NODE_18: "NODE18",
	EDGE: "EDGE",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
} as const;

type Environment = (typeof Environments)[keyof typeof Environments];

const ENVIRONMENT_PROPS: Record<Environment, AstroAWSStackProps> = {
	[Environments.DEV]: {
		...base,
		alias: "dev",
		environment: Environments.DEV,
		hostedZoneName: "astro-aws.org",
		output: "static",
	},
	[Environments.DEV_NODE_16]: {
		...base,
		alias: "node16.dev",
		environment: Environments.DEV_NODE_16,
		hostedZoneName: "astro-aws.org",
		output: "server",
	},
	[Environments.DEV_NODE_18]: {
		...base,
		alias: "node18.dev",
		environment: Environments.DEV_NODE_18,
		hostedZoneName: "astro-aws.org",
		output: "server",
	},
	[Environments.EDGE]: {
		...base,
		alias: "edge.dev",
		env: {
			...base.env,
			region: "us-east-1",
		},
		environment: Environments.EDGE,
		hostedZoneName: "astro-aws.org",
		output: "edge",
	},
	[Environments.PROD]: {
		...base,
		environment: Environments.PROD,
		hostedZoneName: "astro-aws.org",
		output: "static",
	},
	[Environments.PERSONAL]: {
		...base,
		environment: Environments.PERSONAL,
		output: "static",
	},
} as const;

export { Environments, type Environment, ENVIRONMENT_PROPS };
