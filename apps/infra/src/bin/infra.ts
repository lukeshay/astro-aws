import * as process from "node:process";

import { App, Tags } from "aws-cdk-lib";

import { ENVIRONMENT_PROPS } from "../lib/constants/environments.js";
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
	const monitoringStack = new MonitoringStack(app, createStackName(environment, "Monitoring"), {
		...environmentProps,
		env,
	});

	new WebsiteStack(app, createStackName(environment, "Website"), {
		...environmentProps,
		cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
		env,
	});

	Tags.of(app).add("Project", "AstroAWS");
	Tags.of(app).add("Environment", environment);
});
