import * as process from "node:process";

import { App, Tags } from "aws-cdk-lib";

import { AstroAWSStack } from "../lib/stacks/astro-aws-stack.js";

const app = new App();

const env = {
	account: process.env.AWS_ACCOUNT ?? String(process.env.CDK_DEFAULT_ACCOUNT),
	region: process.env.AWS_REGION ?? String(process.env.CDK_DEFAULT_REGION),
};

const stack = new AstroAWSStack(app, `AstroAWSStack-${env.account}-${env.region}`, {
	domainName: "astro-aws.lshay.dev",
	env,
});

Tags.of(app).add("Project", "AstroAWS");
Tags.of(stack).add("Project", "AstroAWS");
