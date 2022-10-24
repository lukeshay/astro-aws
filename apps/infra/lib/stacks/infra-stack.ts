import * as cdk from "aws-cdk-lib";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

import { AstroAWSConstruct } from "../constructs/astro-aws-construct";

export class InfraStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		new AstroAWSConstruct(this, "AstroAWSConstruct", {
			websitePath: "../www",
			lambdaProps: {
				architecture: Architecture.ARM_64,
			},
		});
	}
}
