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
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"

export type UsersStackProps = AstroAWSStackProps

export class UsersStack extends Stack {
	public constructor(
		scope: Construct,
		id: string,
		props: UsersStackProps,
	) {
		super(scope, id, props)

		const codexAgentUser = new User(this, "CodexAgentUser", {
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
			],
			path: "/astro-aws/users/codex/",
			userName: "CodexAgentUser",
		})

		const codexAgentAccessKey = new AccessKey(this, "CodexAgentAccessKey", {
			user: codexAgentUser,
		})

		const codexAgentAccessKeys = new Secret(this, "CodexAgentUserAccessKeys", {
			secretName: "/astro-aws/users/codex/CodexAgentUser/access-keys",
			secretObjectValue: {
				accessKeyId: SecretValue.unsafePlainText(
					codexAgentAccessKey.accessKeyId,
				),
				secretAccessKey: codexAgentAccessKey.secretAccessKey,
			},
		})

		const denyGetKeysPolicy = new Policy(
			this,
			"DenyGetKeysPolicy",
			{
				statements: [
					new PolicyStatement({
						actions: ["secretsmanager:GetSecretValue"],
						effect: Effect.DENY,
						resources: [
							codexAgentAccessKeys.secretArn,
						],
					}),
				],
			},
		)

		codexAgentUser.attachInlinePolicy(denyGetKeysPolicy)
	}
}
