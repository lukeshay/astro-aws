import { dirname, join, resolve } from "node:path";

import { BlockPublicAccess, BucketEncryption, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import type { BucketDeploymentProps } from "aws-cdk-lib/aws-s3-deployment";
import type { BucketProps } from "aws-cdk-lib/aws-s3";
import type { FunctionProps } from "aws-cdk-lib/aws-lambda";

export type AstroAWSBareConstructProps = {
	assetsBucketDeploymentProps?: Omit<BucketDeploymentProps, "destinationBucket" | "sources">;
	assetsBucketProps?: BucketProps;
	lambdaProps?: Omit<FunctionProps, "code" | "handler" | "runtime">;
	websitePath?: string;
	skipDeployment?: boolean;
	node16?: boolean;
};

/**
 * Constructs AWS minimal resources to deploy an Astro website. The resources are:
 * - S3 bucket to host the website assets
 * - Lambda function to handle the requests
 *
 * **NOTE:** This will not work unless you route requests to the Lambda function and fallback to the S3 bucket.
 */
export class AstroAWSBareConstruct extends Construct {
	private readonly props: AstroAWSBareConstructProps;
	public readonly assetsBucket: Bucket;
	public readonly distPath: string;
	public readonly lambda: Function;

	public constructor(scope: Construct, id: string, props: AstroAWSBareConstructProps) {
		super(scope, id);

		this.props = props;

		const { assetsBucketProps = {}, lambdaProps = {}, websitePath, skipDeployment, node16 } = props;

		const distPath = join(resolve(websitePath ?? dirname(".")), "dist");

		const assetsBucket = new Bucket(this, "AssetsBucket", {
			autoDeleteObjects: false,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			publicReadAccess: false,
			removalPolicy: RemovalPolicy.DESTROY,
			...assetsBucketProps,
		});

		const lambda = new Function(this, "Lambda", {
			runtime: node16 ? Runtime.NODEJS_16_X : Runtime.NODEJS_18_X,
			...lambdaProps,
			code: Code.fromAsset(join(distPath, "lambda")),
			handler: "entry.handler",
		});

		this.assetsBucket = assetsBucket;
		this.distPath = distPath;
		this.lambda = lambda;

		if (!skipDeployment) {
			this.createBucketDeployment();
		}
	}

	public createBucketDeployment(props?: Partial<Omit<BucketDeploymentProps, "destinationBucket">>) {
		const finalProps = {
			...this.props.assetsBucketDeploymentProps,
			...props,
			destinationBucket: this.assetsBucket,
			sources: [Source.asset(join(this.distPath, "client")), ...(props?.sources ?? [])],
		};

		return new BucketDeployment(this, "AssetsBucketDeployment", finalProps);
	}
}
