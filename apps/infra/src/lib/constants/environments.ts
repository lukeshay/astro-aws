const base = {
	analyticsReporting: false,
};

export const Environments = {
	DEV: "DEV",
	DEV_NODE_16: "NODE16",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
} as const;

export type Environment = typeof Environments[keyof typeof Environments];

export const ENVIRONMENT_PROPS = {
	[Environments.DEV]: {
		...base,
		domainName: "astro-aws.dev.lshay.dev",
		environment: Environments.DEV,
	},
	[Environments.DEV_NODE_16]: {
		...base,
		domainName: "astro-aws.dev-node-16.lshay.dev",
		environment: Environments.DEV_NODE_16,
	},
	[Environments.PROD]: {
		...base,
		domainName: "astro-aws.lshay.dev",
		environment: Environments.PROD,
	},
	[Environments.PERSONAL]: {
		...base,
		environment: Environments.PERSONAL,
	},
} as const;
