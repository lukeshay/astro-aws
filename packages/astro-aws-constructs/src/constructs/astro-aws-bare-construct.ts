import { dirname, resolve } from "node:path";

import { BlockPublicAccess, BucketEncryption, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import type { BucketDeploymentProps } from "aws-cdk-lib/aws-s3-deployment";
import type { BucketProps } from "aws-cdk-lib/aws-s3";
import type { FunctionProps } from "aws-cdk-lib/aws-lambda";

export type AstroAWSBareConstructBaseProps = {
	assetsBucketDeploymentProps?: Omit<BucketDeploymentProps, "destinationBucket" | "sources">;
	assetsBucketProps?: BucketProps;
	skipDeployment?: boolean;
	websiteDir?: string;
	outDir?: string;
};

export type AstroAWSBareStaticConstructProps = AstroAWSBareConstructBaseProps & {
	output: "static";
};

export type AstroAWSBareServerConstructProps = AstroAWSBareConstructBaseProps & {
	lambdaProps?: Omit<FunctionProps, "code" | "handler" | "runtime">;
	node16?: boolean;
	output: "server";
};

export type AstroAWSBareConstructProps = AstroAWSBareServerConstructProps | AstroAWSBareStaticConstructProps;

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
	public readonly lambda?: Function;
	public readonly isSSR: boolean;

	public constructor(scope: Construct, id: string, props: AstroAWSBareConstructProps) {
		super(scope, id);

		this.props = props;

		const { assetsBucketProps = {}, skipDeployment, output, outDir, websiteDir } = props;

		this.isSSR = output === "server";

		this.distPath = outDir ? resolve(outDir) : resolve(websiteDir ?? dirname("."), "dist");

		this.assetsBucket = new Bucket(this, "AssetsBucket", {
			autoDeleteObjects: false,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			publicReadAccess: false,
			removalPolicy: RemovalPolicy.DESTROY,
			...assetsBucketProps,
		});

		if (output === "server") {
			const { lambdaProps = {}, node16 } = props;

			this.lambda = new Function(this, "Lambda", {
				runtime: node16 ? Runtime.NODEJS_16_X : Runtime.NODEJS_18_X,
				...lambdaProps,
				code: Code.fromAsset(resolve(this.distPath, "lambda")),
				handler: "entry.handler",
			});
		}

		if (!skipDeployment) {
			this.createBucketDeployment();
		}
	}

	public createBucketDeployment(props?: Partial<Omit<BucketDeploymentProps, "destinationBucket">>) {
		const source = this.props.output === "server" ? resolve(this.distPath, "client") : resolve(this.distPath);

		const finalProps = {
			...this.props.assetsBucketDeploymentProps,
			...props,
			destinationBucket: this.assetsBucket,
			sources: [Source.asset(source), ...(props?.sources ?? [])],
		};

		return new BucketDeployment(this, "AssetsBucketDeployment", finalProps);
	}
}
