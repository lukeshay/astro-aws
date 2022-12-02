import { App, Tags } from "aws-cdk-lib";

import { Environments, ENVIRONMENT_PROPS } from "../lib/constants/environments.js";
import { MonitoringStack } from "../lib/stacks/monitoring-stack.js";
import { WebsiteStack } from "../lib/stacks/website-stack.js";
import type { AstroAWSStackProps } from "../lib/types/astro-aws-stack-props.js";
import { RedirectStack } from "../lib/stacks/redirect-stack.js";
import type { CertificateStackProps } from "../lib/stacks/certificate-stack.js";
import { CertificateStack } from "../lib/stacks/certificate-stack.js";

const app = new App();

const createStackName = (environment: string, stack: string, props: AstroAWSStackProps) =>
	`AstroAWS-${environment}-${stack}-${props.env.account}-${props.env.region}`;

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	const monitoringStack = new MonitoringStack(
		app,
		createStackName(environment, "Monitoring", environmentProps),
		environmentProps,
	);

	let certificateStack: CertificateStack | undefined;

	if (environmentProps.hostedZoneName) {
		certificateStack = new CertificateStack(
			app,
			createStackName(environment, "Certificate", environmentProps),
			environmentProps as CertificateStackProps,
		);
	}

	new WebsiteStack(app, createStackName(environment, "Website", environmentProps), {
		...environmentProps,
		certificate: certificateStack?.certificate,
		cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
		hostedZone: certificateStack?.hostedZone,
	});

	if (environment === Environments.PROD && environmentProps.hostedZoneName) {
		const redirectProps = {
			...environmentProps,
			alias: ["www", environmentProps.alias].filter(Boolean).join("."),
		};

		const redirectCertificateStack = new CertificateStack(
			app,
			createStackName(environment, "RedirectCertificate", redirectProps),
			redirectProps as CertificateStackProps,
		);

		new RedirectStack(app, createStackName(environment, "Redirect", redirectProps), {
			...redirectProps,
			certificate: redirectCertificateStack.certificate,
			cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
			hostedZone: redirectCertificateStack.hostedZone,
		});
	}

	Tags.of(app).add("Project", "AstroAWS");
	Tags.of(app).add("Environment", environment);
});
