import type { FunctionUrlOptions } from "aws-cdk-lib/aws-lambda";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import {
	FunctionEventType,
	Function,
	FunctionCode,
	AllowedMethods,
	CachePolicy,
	Distribution,
	OriginAccessIdentity,
	OriginRequestPolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import type { BehaviorOptions, DistributionProps, FunctionAssociation } from "aws-cdk-lib/aws-cloudfront";
import type { HttpOriginProps, S3OriginProps } from "aws-cdk-lib/aws-cloudfront-origins";
import { HttpOrigin, OriginGroup, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Fn } from "aws-cdk-lib";

import { AstroAWSBareConstruct } from "./astro-aws-bare-construct.js";
import type { AstroAWSBareConstructProps } from "./astro-aws-bare-construct.js";

export type AstroAWSConstructProps = AstroAWSBareConstructProps & {
	/** Passed through to the Cloudfront Distribution. */
	distributionProps?: Omit<DistributionProps, "defaultBehavior"> & {
		defaultBehavior?: Omit<DistributionProps["defaultBehavior"], "origin">;
		apiBehavior?: Omit<BehaviorOptions, "origin">;
	};
	/** Passed through to the Lambda Function URL. */
	lambdaFunctionUrlOptions?: FunctionUrlOptions;
	/** Passed through to the Lambda Origin. */
	lambdaOriginProps?: HttpOriginProps;
	/** Passed through to the Bucket Origin. */
	assetsBucketOriginProps?: S3OriginProps;
};

/**
 * Constructs the required AWS resources to deploy an Astro website. The resources are:
 * - S3 bucket to host the website assets
 * - Lambda function to handle the requests (if "server" output)
 * - CloudFront distribution to serve the website
 * - Origin access identity to restrict access to the S3 bucket
 *
 * If "server" output is selected, this works by routing requests to the Lambda function. If the Lambda function returns a 404 response, the Cloudfront distribution falls back to the S3 bucket.
 */
export class AstroAWSConstruct extends AstroAWSBareConstruct {
	public readonly distribution: Distribution;

	public constructor(scope: Construct, id: string, props: AstroAWSConstructProps) {
		super(scope, id, {
			skipDeployment: true,
			...props,
		});

		const {
			distributionProps = {},
			skipDeployment,
			lambdaFunctionUrlOptions = {},
			lambdaOriginProps,
			assetsBucketOriginProps = {},
		} = props;

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

		let lambdaOrigin: HttpOrigin | undefined;

		if (this.lambda) {
			const lambdaFunctionUrl = this.lambda.addFunctionUrl({
				authType: FunctionUrlAuthType.NONE,
				...lambdaFunctionUrlOptions,
			});

			lambdaOrigin = new HttpOrigin(Fn.parseDomainName(lambdaFunctionUrl.url), lambdaOriginProps);
		}

		const bucketOrigin = new S3Origin(this.assetsBucket, {
			...assetsBucketOriginProps,
			originAccessIdentity,
		});

		const redirectToIndexFunction = new Function(this, "RedirectToIndexFunction", {
			code: FunctionCode.fromInline(`
				function handler(event) {
					var request = event.request;
					var uri = request.uri;
			
					if (uri.endsWith("/")) {
						request.uri += "index.html";
					} else if (!uri.includes(".")) {
						request.uri += "/index.html";
					}
			
					return request;
			}
		`),
		});

		const distribution = new Distribution(this, "Distribution", {
			...distributionProps,
			additionalBehaviors: lambdaOrigin
				? {
						"/api/*": {
							allowedMethods: AllowedMethods.ALLOW_ALL,
							compress: true,
							origin: lambdaOrigin,
							originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
							responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
							viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
							...distributionProps.apiBehavior,
						},
						...distributionProps.additionalBehaviors,
				  }
				: distributionProps.additionalBehaviors,
			defaultBehavior: {
				allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
				cachePolicy: CachePolicy.CACHING_OPTIMIZED,
				compress: true,
				originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
				responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				...distributionProps.defaultBehavior,
				functionAssociations: [
					!this.isSSR && {
						eventType: FunctionEventType.VIEWER_REQUEST,
						function: redirectToIndexFunction,
					},
					...(distributionProps.defaultBehavior?.functionAssociations ?? []),
				].filter(Boolean) as FunctionAssociation[],
				origin: lambdaOrigin
					? new OriginGroup({
							fallbackOrigin: bucketOrigin,
							fallbackStatusCodes: [404],
							primaryOrigin: lambdaOrigin,
					  })
					: bucketOrigin,
			},
		});

		this.distribution = distribution;

		if (!skipDeployment) {
			this.createBucketDeployment({
				distribution,
				distributionPaths: ["/*"],
			});
		}
	}
}
