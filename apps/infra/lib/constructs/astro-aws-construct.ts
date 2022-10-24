import { dirname, join, resolve } from "node:path";

import { FunctionProps, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { BlockPublicAccess, BucketEncryption, BucketProps } from "aws-cdk-lib/aws-s3";
import { Bucket } from "aws-cdk-lib/aws-s3";
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
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Fn, RemovalPolicy } from "aws-cdk-lib";

export type AstroAwsConstructProps = {
	assetsBucketProps?: BucketProps;
	distributionProps?: Omit<DistributionProps, "defaultBehavior"> & {
		defaultBehavior?: Omit<DistributionProps["defaultBehavior"], "origin">;
	};
	lambdaProps?: Omit<FunctionProps, "code" | "runtime" | "handler">;
	websitePath?: string;
};

export class AstroAWSConstruct extends Construct {
	constructor(scope: Construct, id: string, props: AstroAwsConstructProps) {
		super(scope, id);

		const { assetsBucketProps = {}, distributionProps = {}, lambdaProps = {}, websitePath } = props;

		const distPath = join(resolve(websitePath ?? dirname(".")), "dist");

		const originAccessIdentity = new OriginAccessIdentity(this, "CloudfrontOAI", {
			comment: `OAI for ${id}`,
		});

		const assetsBucket = new Bucket(this, "AssetsBucket", {
			autoDeleteObjects: false,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			publicReadAccess: false,
			removalPolicy: RemovalPolicy.DESTROY,
			...assetsBucketProps,
		});

		assetsBucket.addToResourcePolicy(
			new PolicyStatement({
				actions: ["s3:GetObject"],
				principals: [
					new CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)
						.grantPrincipal,
				],
				resources: [assetsBucket.arnForObjects("*")],
			}),
		);

		const lambda = new Function(this, "Lambda", {
			...lambdaProps,
			code: Code.fromAsset(join(distPath, "lambda")),
			handler: "entry.handler",
			runtime: Runtime.NODEJS_16_X,
		});

		// lambda.addToRolePolicy(
		// 	new PolicyStatement({
		// 		actions: ["lambda:InvokeFunctionUrl"],
		// 		principals: [new AnyPrincipal()],
		// 		resources: [lambda.functionArn],
		// 		conditions: {
		// 			StringEquals: {
		// 				"lambda:FunctionUrlAuthType": FunctionUrlAuthType.NONE,
		// 			},
		// 		},
		// 	}),
		// );

		const lambdaFunctionUrl = lambda.addFunctionUrl({ authType: FunctionUrlAuthType.NONE });

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
					fallbackOrigin: new S3Origin(assetsBucket, { originAccessIdentity }),
					fallbackStatusCodes: [404],
				}),
			},
		});

		new BucketDeployment(this, "AssetsBucketDeployment", {
			destinationBucket: assetsBucket,
			distribution,
			distributionPaths: ["/*"],
			sources: [Source.asset(join(distPath, "client"))],
		});
	}
}
