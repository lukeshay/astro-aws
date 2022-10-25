import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import {
	CachePolicy,
	Distribution,
	DistributionProps,
	OriginAccessIdentity,
	OriginRequestPolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { HttpOrigin, OriginGroup, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Fn } from "aws-cdk-lib";

import { AstroAWSBareConstruct } from "./astro-aws-bare-construct";
import type { AstroAWSBareConstructProps } from "./astro-aws-bare-construct";

export type AstroAWSConstructProps = Omit<AstroAWSBareConstructProps, "skipDeployment"> & {
	distributionProps?: Omit<DistributionProps, "defaultBehavior"> & {
		defaultBehavior?: Omit<DistributionProps["defaultBehavior"], "origin">;
	};
};

/**
 * Constructs the required AWS resources to deploy an Astro website. The resources are:
 * - S3 bucket to host the website assets
 * - Lambda function to handle the requests
 * - CloudFront distribution to serve the website
 * - Origin access identity to restrict access to the S3 bucket
 *
 * This works by routing requests to the Lambda function. If the Lambda function returns a 404 response, the Cloudfront distribution falls back to the S3 bucket.
 */
export class AstroAWSConstruct extends AstroAWSBareConstruct {
	public readonly distribution: Distribution;

	public constructor(scope: Construct, id: string, props: AstroAWSConstructProps) {
		super(scope, id, { ...props, skipDeployment: true });

		const { distributionProps = {} } = props;

		const originAccessIdentity = new OriginAccessIdentity(this, "CloudfrontOAI", {
			comment: `OAI for ${id}`,
		});

		this.assetsBucket.addToResourcePolicy(
			new PolicyStatement({
				actions: ["s3:GetObject"],
				principals: [
					new CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)
						.grantPrincipal,
				],
				resources: [this.assetsBucket.arnForObjects("*")],
			}),
		);

		const lambdaFunctionUrl = this.lambda.addFunctionUrl({ authType: FunctionUrlAuthType.NONE });

		const distribution = new Distribution(this, "Distribution", {
			...distributionProps,
			defaultBehavior: {
				cachePolicy: CachePolicy.CACHING_OPTIMIZED,
				originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
				responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				compress: true,
				...distributionProps.defaultBehavior,
				origin: new OriginGroup({
					primaryOrigin: new HttpOrigin(Fn.parseDomainName(lambdaFunctionUrl.url)),
					fallbackOrigin: new S3Origin(this.assetsBucket, { originAccessIdentity }),
					fallbackStatusCodes: [404],
				}),
			},
		});

		this.distribution = distribution;

		this.createBucketDeployment(distribution);
	}
}
