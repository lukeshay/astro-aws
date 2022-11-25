import * as cdk from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { FederatedPrincipal, ManagedPolicy, OpenIdConnectProvider, Role } from "aws-cdk-lib/aws-iam";

export type GitHubOIDCStackProps = StackProps;

export class GitHubOIDCStack extends cdk.Stack {
	public constructor(scope: Construct, id: string, props: GitHubOIDCStackProps) {
		super(scope, id, props);

		const gitHubOIDC = new OpenIdConnectProvider(this, "GitHubOIDC", {
			clientIds: ["sts.amazonaws.com"],
			thumbprints: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
			url: "https://token.actions.githubusercontent.com",
		});

		new Role(this, "GitHubOIDCAdminRole", {
			assumedBy: new FederatedPrincipal(gitHubOIDC.openIdConnectProviderArn, {
				"ForAllValues:StringEquals": {
					"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
					"token.actions.githubusercontent.com:iss": "https://token.actions.githubusercontent.com",
				},
				StringLike: {
					"token.actions.githubusercontent.com:sub": "repo:lukeshay/astro-aws:ref:refs/heads/main",
				},
			}),
			managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")],
			roleName: "GitHubOIDCAdminRole",
		});

		new Role(this, "GitHubOIDCReadOnlyRole", {
			assumedBy: new FederatedPrincipal(gitHubOIDC.openIdConnectProviderArn, {
				"ForAllValues:StringEquals": {
					"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
					"token.actions.githubusercontent.com:iss": "https://token.actions.githubusercontent.com",
				},
				StringLike: {
					"token.actions.githubusercontent.com:sub": "repo:lukeshay/astro-aws:ref:refs/heads/*",
				},
			}),
			managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("ReadOnlyAccess")],
			roleName: "GitHubOIDCReadOnlyRole",
		});
	}
}
