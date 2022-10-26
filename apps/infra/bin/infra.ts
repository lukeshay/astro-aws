import * as cdk from "aws-cdk-lib";

import { InfraStack } from "../lib/stacks/infra-stack.js";

const app = new cdk.App();

new InfraStack(app, "InfraStack", {
	hostedZoneId: "Z087719511RJWBDA42276",
	hostedZoneName: "astro-aws.lshay.dev",
});
