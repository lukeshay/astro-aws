import * as process from "node:process";

import { App, Tags } from "aws-cdk-lib";

import { AstroAWSStack } from "../lib/stacks/astro-aws-stack.js";
import { ENVIRONMENT_PROPS } from "../lib/constants/environments.js";

const app = new App();

const env = {
	account: process.env.AWS_ACCOUNT ?? String(process.env.CDK_DEFAULT_ACCOUNT),
	region: process.env.AWS_REGION ?? String(process.env.CDK_DEFAULT_REGION),
};

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	const stack = new AstroAWSStack(app, `AstroAWSStack-${environment}-${env.account}-${env.region}`, {
		...environmentProps,
		env,
	});

	Tags.of(stack).add("Project", "AstroAWS");
	Tags.of(stack).add("Environment", environment);
});
