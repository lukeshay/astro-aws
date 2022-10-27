import * as cdk from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import {
	CacheCookieBehavior,
	CacheHeaderBehavior,
	CachePolicy,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { AstroAWSConstruct } from "@astro-aws/constructs";

export type AstroAWSProps = StackProps & {
	domainName: string;
};

export class AstroAWSStack extends cdk.Stack {
	public constructor(scope: Construct, id: string, props: AstroAWSProps) {
		super(scope, id, props);

		const { domainName } = props;

		const certificate = new Certificate(this, "Certificate", {
			domainName,
		});

		new AstroAWSConstruct(this, "AstroAWSConstruct", {
			distributionProps: {
				certificate,
				defaultBehavior: {
					cachePolicy: new CachePolicy(this, "CachePolicy", {
						cachePolicyName: "AstroAwsCachePolicy",
						cookieBehavior: CacheCookieBehavior.all(),
						defaultTtl: Duration.days(1),
						enableAcceptEncodingBrotli: true,
						enableAcceptEncodingGzip: true,
						headerBehavior: CacheHeaderBehavior.none(),
						maxTtl: Duration.days(2),
						minTtl: Duration.seconds(2),
						queryStringBehavior: CacheQueryStringBehavior.all(),
					}),
				},
				domainNames: [domainName],
			},
			lambdaProps: {
				architecture: Architecture.ARM_64,
				memorySize: 1024,
			},
			websitePath: "../www",
		});
	}
}
