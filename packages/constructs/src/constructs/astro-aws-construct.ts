import { dirname, resolve } from "node:path";

import type { FunctionProps, FunctionUrl, FunctionUrlOptions } from "aws-cdk-lib/aws-lambda";
import { Code, Runtime, FunctionUrlAuthType, Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import {
	FunctionEventType,
	Function,
	FunctionCode,
	AllowedMethods,
	Distribution,
	OriginAccessIdentity,
	OriginRequestPolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import type { BehaviorOptions, DistributionProps, IOrigin } from "aws-cdk-lib/aws-cloudfront";
import type { HttpOriginProps, S3OriginProps } from "aws-cdk-lib/aws-cloudfront-origins";
import { HttpOrigin, OriginGroup, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Fn } from "aws-cdk-lib";
import type { BucketDeploymentProps } from "aws-cdk-lib/aws-s3-deployment";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { BucketProps } from "aws-cdk-lib/aws-s3";
import { Bucket, BlockPublicAccess, BucketEncryption } from "aws-cdk-lib/aws-s3";

export type StaticProps = {
	output: "static";
};

export type SSRProps = {
	lambdaFunctionProps?: Omit<FunctionProps, "code" | "handler" | "runtime">;
	node16?: boolean;
	output: "server";
	/** Passed through to the Lambda Function URL. */
	lambdaFunctionUrlOptions?: FunctionUrlOptions;
	/** Passed through to the Lambda Origin. */
	lambdaOriginProps?: HttpOriginProps;
};

export type OutputProps = SSRProps | StaticProps;

export type AstroAWSConstructProps = OutputProps & {
	/** Passed through to the Cloudfront Distribution. */
	cloudfrontDistributionProps?: Omit<DistributionProps, "defaultBehavior"> & {
		defaultBehavior?: Omit<BehaviorOptions, "origin">;
		apiBehavior?: Omit<BehaviorOptions, "origin">;
	};
	/** Passed through to the Bucket Origin. */
	assetsBucketOriginProps?: Omit<S3OriginProps, "originAccessIdentity">;
	s3BucketDeploymentProps?: Omit<BucketDeploymentProps, "destinationBucket" | "sources">;
	s3BucketProps?: BucketProps;
	skipBucketDeployment?: boolean;
	websiteDir?: string;
	outDir?: string;
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
export class AstroAWSConstruct extends Construct {
	private readonly props: AstroAWSConstructProps;
	public distDir: string;
	public cloudfrontDistribution: Distribution;
	public lambdaFunction?: LambdaFunction;
	public lambdaFunctionOrigin?: HttpOrigin;
	public lambdaFunctionUrl?: FunctionUrl;
	public s3Bucket: Bucket;
	public s3BucketOrigin: S3Origin;
	public s3BucketDeployment?: BucketDeployment;
	public s3OriginAccessIdentity: OriginAccessIdentity;
	public redirectToIndexCloudfrontFunction?: Function;
	public defaultOrigin: IOrigin;

	public constructor(scope: Construct, id: string, props: AstroAWSConstructProps) {
		super(scope, id);

		this.props = props;

		const {
			assetsBucketOriginProps = {},
			cloudfrontDistributionProps = {},
			outDir,
			s3BucketProps = {},
			skipBucketDeployment = false,
			websiteDir = dirname("."),
			output,
		} = props;

		const { distDir, s3Bucket, s3OriginAccessIdentity } = this.createCommonBaseResources(
			outDir,
			websiteDir,
			s3BucketProps,
			id,
		);

		this.distDir = distDir;
		this.s3Bucket = s3Bucket;
		this.s3OriginAccessIdentity = s3OriginAccessIdentity;

		this.s3BucketOrigin = new S3Origin(this.s3Bucket, {
			...assetsBucketOriginProps,
			originAccessIdentity: this.s3OriginAccessIdentity,
		});

		if (output === "server") {
			this.createSSROnlyResources(props);

			this.defaultOrigin = new OriginGroup({
				fallbackOrigin: this.s3BucketOrigin,
				fallbackStatusCodes: [404],
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				primaryOrigin: this.lambdaFunctionOrigin!,
			});
		} else {
			this.createStaticOnlyResources();

			this.defaultOrigin = this.s3BucketOrigin;
		}

		this.cloudfrontDistribution = new Distribution(this, "Distribution", {
			...cloudfrontDistributionProps,
			additionalBehaviors: this.lambdaFunctionOrigin
				? {
						"/api/*": {
							allowedMethods: AllowedMethods.ALLOW_ALL,
							origin: this.lambdaFunctionOrigin,
							originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
							responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
							viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
							...cloudfrontDistributionProps.apiBehavior,
						},
						...cloudfrontDistributionProps.additionalBehaviors,
				  }
				: cloudfrontDistributionProps.additionalBehaviors,
			defaultBehavior: {
				functionAssociations: this.redirectToIndexCloudfrontFunction
					? [
							{
								eventType: FunctionEventType.VIEWER_REQUEST,
								function: this.redirectToIndexCloudfrontFunction,
							},
							...(cloudfrontDistributionProps.defaultBehavior?.functionAssociations ?? []),
					  ]
					: cloudfrontDistributionProps.defaultBehavior?.functionAssociations,
				origin: this.defaultOrigin,
				originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
				responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				...cloudfrontDistributionProps.defaultBehavior,
			},
		});

		if (!skipBucketDeployment) {
			this.createBucketDeployment({
				distributionPaths: ["/*"],
			});
		}
	}

	private createCommonBaseResources(
		outDir: string | undefined,
		websiteDir: string,
		s3BucketProps: BucketProps,
		id: string,
	) {
		const distDir = outDir ? resolve(outDir) : resolve(websiteDir, "dist");

		const s3Bucket = new Bucket(this, "S3Bucket", {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			...s3BucketProps,
		});

		const s3OriginAccessIdentity = new OriginAccessIdentity(this, "CloudfrontOAI", {
			comment: `OAI for ${id}`,
		});

		s3Bucket.addToResourcePolicy(
			new PolicyStatement({
				actions: ["s3:GetObject"],
				principals: [
					new CanonicalUserPrincipal(s3OriginAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)
						.grantPrincipal,
				],
				resources: [s3Bucket.arnForObjects("*")],
			}),
		);

		return {
			distDir,
			s3Bucket,
			s3OriginAccessIdentity,
		};
	}

	private createStaticOnlyResources() {
		this.redirectToIndexCloudfrontFunction = new Function(this, "RedirectToIndexFunction", {
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
	}

	private createSSROnlyResources(props: AstroAWSConstructProps & SSRProps) {
		const { lambdaFunctionProps = {}, node16, lambdaFunctionUrlOptions, lambdaOriginProps } = props;

		this.lambdaFunction = new LambdaFunction(this, "Lambda", {
			memorySize: 512,
			runtime: node16 ? Runtime.NODEJS_16_X : Runtime.NODEJS_18_X,
			...lambdaFunctionProps,
			code: Code.fromAsset(resolve(this.distDir, "lambda")),
			handler: "entry.handler",
		});

		this.lambdaFunctionUrl = this.lambdaFunction.addFunctionUrl({
			authType: FunctionUrlAuthType.NONE,
			...lambdaFunctionUrlOptions,
		});

		this.lambdaFunctionOrigin = new HttpOrigin(Fn.parseDomainName(this.lambdaFunctionUrl.url), lambdaOriginProps);
	}

	public createBucketDeployment(props?: Partial<Omit<BucketDeploymentProps, "destinationBucket" | "distribution">>) {
		const source = this.props.output === "server" ? resolve(this.distDir, "client") : resolve(this.distDir);

		this.s3BucketDeployment = new BucketDeployment(this, "BucketDeployment", {
			...this.props.s3BucketDeploymentProps,
			...props,
			destinationBucket: this.s3Bucket,
			distribution: this.cloudfrontDistribution,
			sources: [Source.asset(source), ...(props?.sources ?? [])],
		});

		return this.s3BucketDeployment;
	}
}
