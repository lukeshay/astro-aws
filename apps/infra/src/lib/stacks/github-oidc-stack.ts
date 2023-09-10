import * as cdk from "aws-cdk-lib/core"
import type { Construct } from "constructs"
import {
	FederatedPrincipal,
	ManagedPolicy,
	OpenIdConnectProvider,
	Role,
} from "aws-cdk-lib/aws-iam"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props"
import { Environments } from "../constants/environments"

export type GitHubOIDCStackProps = AstroAWSStackProps

export class GitHubOIDCStack extends cdk.Stack {
	public constructor(
		scope: Construct,
		id: string,
		props: GitHubOIDCStackProps,
	) {
		super(scope, id, props)

		const gitHubOIDC = new OpenIdConnectProvider(this, "GitHubOIDC", {
			clientIds: ["sts.amazonaws.com"],
			thumbprints: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
			url: "https://token.actions.githubusercontent.com",
		})

		new Role(this, "GitHubOIDCAdminRole", {
			assumedBy: new FederatedPrincipal(
				gitHubOIDC.openIdConnectProviderArn,
				{
					StringEquals: {
						"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
					},
					StringLike: {
						"token.actions.githubusercontent.com:sub":
							"repo:lukeshay/astro-aws:main",
					},
				},
				"sts:AssumeRoleWithWebIdentity",
			),
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
			],
			roleName: "GitHubOIDCAdminRole",
		})

		if (props.environment !== Environments.PROD) {
			new Role(this, "GitHubOIDCReadOnlyRole", {
				assumedBy: new FederatedPrincipal(
					gitHubOIDC.openIdConnectProviderArn,
					{
						StringEquals: {
							"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
						},
						StringLike: {
							"token.actions.githubusercontent.com:sub":
								"repo:lukeshay/astro-aws:*",
						},
					},
					"sts:AssumeRoleWithWebIdentity",
				),
				managedPolicies: [
					ManagedPolicy.fromAwsManagedPolicyName("ReadOnlyAccess"),
				],
				roleName: "GitHubOIDCReadOnlyRole",
			})
		}
	}
}
