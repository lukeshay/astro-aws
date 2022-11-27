const base = {
	analyticsReporting: false,
};

export const Environments = {
	DEV: "DEV",
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
