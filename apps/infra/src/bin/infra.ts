import { App, Tags } from "aws-cdk-lib/core"

import {
	Environments,
	ENVIRONMENT_PROPS,
} from "../lib/constants/environments.js"
import { MonitoringStack } from "../lib/stacks/monitoring-stack.js"
import { WebsiteStack } from "../lib/stacks/website-stack.js"
import { RedirectStack } from "../lib/stacks/redirect-stack.js"
import type { CertificateStackProps } from "../lib/stacks/certificate-stack.js"
import { CertificateStack } from "../lib/stacks/certificate-stack.js"
import { GitHubOIDCStack } from "../lib/stacks/github-oidc-stack.js"
import { GitHubUsersStack } from "../lib/stacks/github-users-stack.js"

const app = new App()

const createStackName = (environment: string, stack: string) =>
	`AstroAWS-${environment}-${stack}`

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	const monitoringStack = new MonitoringStack(
		app,
		createStackName(environment, "Monitoring"),
		environmentProps,
	)

	let certificateStack: CertificateStack | undefined

	if (environmentProps.hostedZoneName) {
		certificateStack = new CertificateStack(
			app,
			createStackName(environment, "Certificate"),
			environmentProps as CertificateStackProps,
		)
	}

	if (environment === Environments.DEV) {
		new GitHubUsersStack(
			app,
			createStackName(environment, "GitHubUsers"),
			environmentProps,
		)

		new GitHubOIDCStack(
			app,
			createStackName(environment, "GitHubOIDC"),
			environmentProps,
		)
	}

	new WebsiteStack(app, createStackName(environment, "Website"), {
		...environmentProps,
		certificate: certificateStack?.certificate,
		cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
		hostedZone: certificateStack?.hostedZone,
	})

	if (environment === Environments.PROD && environmentProps.hostedZoneName) {
		const redirectProps = {
			...environmentProps,
			alias: ["www", environmentProps.alias].filter(Boolean).join("."),
		}

		const redirectCertificateStack = new CertificateStack(
			app,
			createStackName(environment, "RedirectCertificate"),
			redirectProps as CertificateStackProps,
		)

		new RedirectStack(app, createStackName(environment, "Redirect"), {
			...redirectProps,
			certificate: redirectCertificateStack.certificate,
			cloudwatchDashboard: monitoringStack.cloudwatchDashboard,
			hostedZone: redirectCertificateStack.hostedZone,
		})
	}

	Tags.of(app).add("Project", "AstroAWS")
	Tags.of(app).add("Environment", environment)
})
