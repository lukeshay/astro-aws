import type { Construct } from "constructs"
import {
	ManagedPolicy,
	User,
	AccessKey,
	Policy,
	PolicyStatement,
	Effect,
} from "aws-cdk-lib/aws-iam"
import { SecretValue, Stack } from "aws-cdk-lib/core"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

export type GitHubUsersStackProps = AstroAWSStackProps

export class GitHubUsersStack extends Stack {
	public constructor(
		scope: Construct,
		id: string,
		props: GitHubUsersStackProps,
	) {
		super(scope, id, props)

		const adminUser = new User(this, "GitHubAdminUser", {
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
			],
			path: "/astro-aws/users/",
			userName: "GitHubAdminUser",
		})

		const readOnlyUser = new User(this, "GitHubReadOnlyUser", {
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName("ReadOnlyAccess"),
			],
			path: "/astro-aws/users/",
			userName: "GitHubReadOnlyUser",
		})

		const adminAccessKey = new AccessKey(this, "GitHubAdminAccessKey", {
			user: adminUser,
		})

		const readOnlyAccessKey = new AccessKey(this, "GitHubReadOnlyAccessKey", {
			user: readOnlyUser,
		})

		const adminAccessKeys = new Secret(this, "GitHubAdminUserAccessKeys", {
			secretName: "/astro-aws/users/github/GitHubAdminUser/access-keys",
			secretObjectValue: {
				accessKeyId: SecretValue.unsafePlainText(adminAccessKey.accessKeyId),
				secretAccessKey: adminAccessKey.secretAccessKey,
			},
		})

		const readOnlyAccessKeys = new Secret(
			this,
			"GitHubReadOnlyUserAccessKeys",
			{
				secretName: "/astro-aws/users/github/GitHubReadOnlyUser/access-keys",
				secretObjectValue: {
					accessKeyId: SecretValue.unsafePlainText(
						readOnlyAccessKey.accessKeyId,
					),
					secretAccessKey: readOnlyAccessKey.secretAccessKey,
				},
			},
		)

		const denyGetGitHubKeysPolicy = new Policy(
			this,
			"DenyGetGitHubKeysPolicy",
			{
				statements: [
					new PolicyStatement({
						actions: ["secretsmanager:GetSecretValue"],
						effect: Effect.DENY,
						resources: [
							readOnlyAccessKeys.secretArn,
							adminAccessKeys.secretArn,
						],
					}),
				],
			},
		)

		adminUser.attachInlinePolicy(denyGetGitHubKeysPolicy)
		readOnlyUser.attachInlinePolicy(denyGetGitHubKeysPolicy)
	}
}
