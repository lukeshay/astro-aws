import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";

import { AstroAWSStack } from "../lib/stacks/astro-aws-stack.js";

const app = new cdk.App();

const stack = new AstroAWSStack(app, "AstroAWSStack", {
	domainName: "astro-aws.lshay.dev",
});

Tags.of(app).add("Project", "AstroAWS");
Tags.of(stack).add("Project", "AstroAWS");
