import { App, Tags } from "aws-cdk-lib/core"

import {
	Environments,
	ENVIRONMENT_PROPS,
} from "../lib/constants/environments.js"
import { WebsiteStack } from "../lib/stacks/website-stack.js"
import { GitHubOIDCStack } from "../lib/stacks/github-oidc-stack.js"
import { GitHubUsersStack } from "../lib/stacks/github-users-stack.js"
import { RedirectStack } from "../lib/stacks/redirect-stack.js"
import { DistributionLoggingStack } from "../lib/stacks/distribution-logging-stack.js"

const app = new App()

const createStackName = (
	environment: string,
	stack: string,
	runtime?: string,
	mode?: string,
) =>
	[
		"AstroAWS",
		environment,
		stack,
		environment === "PROD" ? "nodejs20" : runtime,
		mode,
	]
		.filter(Boolean)
		.join("-")

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	environmentProps.websites.forEach((websiteProps) => {
		const websiteStack = new WebsiteStack(
			app,
			createStackName(
				environment,
				"Website",
				websiteProps.runtime,
				websiteProps.mode,
			),
			{
				...environmentProps,
				...websiteProps,
			},
		)

		new DistributionLoggingStack(
			app,
			createStackName(
				environment,
				"DistributionLogging",
				websiteProps.runtime,
				websiteProps.mode,
			),
			{
				...environmentProps,
				mode: websiteProps.mode,
				runtime: websiteProps.runtime,
				astroAWS: websiteStack.astroAWS,
			},
		)

		if (
			websiteProps.alias &&
			websiteProps.redirectAliases &&
			websiteProps.hostedZoneName
		) {
			new RedirectStack(
				app,
				createStackName(
					environment,
					"Redirect",
					websiteProps.runtime,
					websiteProps.mode,
				),
				{
					...environmentProps,
					alias: websiteProps.alias,
					redirectAliases: websiteProps.redirectAliases,
					hostedZoneName: websiteProps.hostedZoneName,
				},
			)
		}
	})

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

	Tags.of(app).add("Project", "AstroAWS")
	Tags.of(app).add("Environment", environment)
})
