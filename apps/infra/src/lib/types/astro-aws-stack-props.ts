import type { StackProps } from "aws-cdk-lib";

import type { Environment } from "../constants/environments.js";

export type AstroAWSStackProps = Readonly<
	Omit<StackProps, "env"> & {
		env: {
			account: string;
			region: string;
		};
		environment: Environment;
		alias?: string;
		hostedZoneId?: string;
		hostedZoneName?: string;
		output: "server" | "static";
	}
>;
