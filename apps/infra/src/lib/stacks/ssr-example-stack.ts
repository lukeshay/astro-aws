import { env } from "node:process";

import { CfnOutput, Stack } from "aws-cdk-lib";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { AstroAWS } from "@astro-aws/constructs";

import { Environments } from "../constants/environments.js";
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js";

export type SSRExampleProps = AstroAWSStackProps;

export class SSRExample extends Stack {
	public constructor(scope: Construct, id: string, props: SSRExampleProps) {
		super(scope, id, props);

		const { environment, output } = props;

		const astroAwsConstruct = new AstroAWS(this, "AstroAWSConstruct", {
			cdk: {
				cloudfrontDistribution: {
					comment: `${environment} SSR Examples`,
					priceClass: PriceClass.PRICE_CLASS_100,
					webAclId: env.WEB_ACL_ARN && env.WEB_ACL_ARN.length > 0 ? env.WEB_ACL_ARN : undefined,
				},
			},
			output,
			websiteDir: "../../examples/ssr",
		});

		new CfnOutput(this, "CloudFrontDistributionId", {
			value: astroAwsConstruct.cdk.cloudfrontDistribution.distributionId,
		});

		new CfnOutput(this, "CloudFrontDomainName", {
			value: astroAwsConstruct.cdk.cloudfrontDistribution.distributionDomainName,
		});
	}
}
