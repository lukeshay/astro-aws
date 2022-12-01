import * as process from "node:process";

import { App, Tags } from "aws-cdk-lib";

import { Environments, ENVIRONMENT_PROPS } from "../lib/constants/environments.js";
import { MonitoringStack } from "../lib/stacks/monitoring-stack.js";
import { WebsiteStack } from "../lib/stacks/website-stack.js";
import { AstroAWSStackProps } from "../lib/types/astro-aws-stack-props.js";
import { RedirectStack } from "../lib/stacks/redirect-stack.js";

const app = new App();

const createStackName = (environment: string, stack: string, props: AstroAWSStackProps) =>
	`AstroAWS-${environment}-${stack}-${props.env.account}-${props.env.region}`;

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	const monitoringStack = new MonitoringStack(
		app,
		createStackName(environment, "Monitoring", environmentProps),
		environmentProps,
	);

	new WebsiteStack(app, createStackName(environment, "Website", environmentProps), {
		...environmentProps,
		cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
	});

	if (environment === Environments.PROD) {
		new RedirectStack(app, createStackName(environment, "Redirect", environmentProps), {
			...environmentProps,
			cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
			hostedZoneId: String(environmentProps.hostedZoneId),
			hostedZoneName: String(environmentProps.hostedZoneName),
		});
	}

	Tags.of(app).add("Project", "AstroAWS");
	Tags.of(app).add("Environment", environment);
});
