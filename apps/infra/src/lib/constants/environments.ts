export const Environments = {
	DEV: "DEV",
	PERSONAL: "PERSONAL",
	PROD: "PROD",
} as const;

export type Environment = typeof Environments[keyof typeof Environments];

export const ENVIRONMENT_PROPS = {
	[Environments.DEV]: {
		domainName: "astro-aws.dev.lshay.dev",
	},
	[Environments.PROD]: {
		domainName: "astro-aws.lshay.dev",
	},
	[Environments.PERSONAL]: {},
} as const;
