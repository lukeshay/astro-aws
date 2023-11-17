import { App, Tags } from "aws-cdk-lib/core"

import {
	Environments,
	ENVIRONMENT_PROPS,
} from "../lib/constants/environments.js"
import { WebsiteStack } from "../lib/stacks/website-stack.js"
import { CertificateStack } from "../lib/stacks/certificate-stack.js"
import { GitHubOIDCStack } from "../lib/stacks/github-oidc-stack.js"
import { GitHubUsersStack } from "../lib/stacks/github-users-stack.js"

const app = new App()

const createStackName = (
	environment: string,
	stack: string,
	runtime?: string,
	mode?: string,
) => ["AstroAWS", environment, stack, runtime, mode].filter(Boolean).join("-")

Object.entries(ENVIRONMENT_PROPS).forEach(([environment, environmentProps]) => {
	environmentProps.websites.forEach((websiteProps) => {
		let certificateStack: CertificateStack | undefined

		if (environment === Environments.DEV) {
			// eslint-disable-next-line no-param-reassign
			delete websiteProps.hostedZoneName
			// eslint-disable-next-line no-param-reassign
			delete websiteProps.aliases
		}

		if (websiteProps.hostedZoneName && websiteProps.aliases) {
			certificateStack = new CertificateStack(
				app,
				createStackName(
					environment,
					"Certificate",
					websiteProps.runtime,
					websiteProps.mode,
				),
				{
					...environmentProps,
					aliases: websiteProps.aliases,
					hostedZoneName: websiteProps.hostedZoneName,
				},
			)
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
				certificate: certificateStack?.certificate,
				hostedZone: certificateStack?.hostedZone,
			},
		)
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
