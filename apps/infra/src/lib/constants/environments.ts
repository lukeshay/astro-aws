const base = {
	analyticsReporting: false,
	hostedZoneId: "Z0584480MGUI8KRBPWM",
};

export const Environments = {
	DEV: "DEV",
	DEV_NODE_16: "NODE16",
	DEV_NODE_18: "NODE18",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
} as const;

export type Environment = typeof Environments[keyof typeof Environments];

export const ENVIRONMENT_PROPS = {
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
