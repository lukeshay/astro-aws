import { App, Tags } from "aws-cdk-lib/core"

import {
	Environments,
	ENVIRONMENT_PROPS,
} from "../lib/constants/environments.js"
import { WebsiteStack } from "../lib/stacks/website-stack.js"
import { GitHubOIDCStack } from "../lib/stacks/github-oidc-stack.js"
import { GitHubUsersStack } from "../lib/stacks/github-users-stack.js"
import { RedirectStack } from "../lib/stacks/redirect-stack.js"

const app = new App()

const createStackName = (
	environment: string,
	stack: string,
	runtime?: string,
	mode?: string,
) => ["AstroAWS", environment, stack, runtime, mode].filter(Boolean).join("-")

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	environmentProps.websites.forEach((websiteProps) => {
		if (environment === Environments.DEV) {
			// eslint-disable-next-line no-param-reassign
			delete websiteProps.hostedZoneName
			// eslint-disable-next-line no-param-reassign
			delete websiteProps.aliases
			// eslint-disable-next-line no-param-reassign
			delete websiteProps.redirectAliases
		}

		new WebsiteStack(
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

		if (websiteProps.redirectAliases && websiteProps.hostedZoneName) {
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
					aliases: websiteProps.redirectAliases,
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
