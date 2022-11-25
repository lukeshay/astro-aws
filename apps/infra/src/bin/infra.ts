import * as process from "node:process";

import type { Stack } from "aws-cdk-lib";
import { App, Tags } from "aws-cdk-lib";

import { ENVIRONMENT_PROPS } from "../lib/constants/environments.js";
import { GitHubOIDCStack } from "../lib/stacks/github-oidc-stack.js";
import { MonitoringStack } from "../lib/stacks/monitoring-stack.js";
import { WebsiteStack } from "../lib/stacks/website-stack.js";

const app = new App();

const env = {
	account: process.env.AWS_ACCOUNT ?? String(process.env.CDK_DEFAULT_ACCOUNT),
	region: process.env.AWS_REGION ?? String(process.env.CDK_DEFAULT_REGION),
};

const createStackName = (environment: string, stack: string) =>
	`AstroAWS-${environment}-${stack}-${env.account}-${env.region}`;

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	const stacks: Stack[] = [];

	const monitoringStack = new MonitoringStack(app, createStackName(environment, "Monitoring"), {
		...environmentProps,
		env,
	});

	stacks.push(monitoringStack);

	const websiteStack = new WebsiteStack(app, createStackName(environment, "WebsiteStack"), {
		...environmentProps,
		cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
		env,
	});

	stacks.push(websiteStack);

	if (environment === "DEV") {
		const gitHubOIDCStack = new GitHubOIDCStack(app, createStackName(environment, "GitHubOIDCStack"), {
			...environmentProps,
			env,
		});

		stacks.push(gitHubOIDCStack);
	}

	// stacks.forEach((stack) => {
	// 	Tags.of(stack).add("Project", "AstroAWS");
	// 	Tags.of(stack).add("Environment", environment);
	// });

	Tags.of(app).add("Project", "AstroAWS");
	Tags.of(app).add("Environment", environment);
});
