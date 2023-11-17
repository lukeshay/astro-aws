import { resolve } from "node:path"

import {
	type FunctionProps,
	Code,
	Function,
	Runtime,
	Architecture,
} from "aws-cdk-lib/aws-lambda"
import { type Construct } from "constructs"

import { AstroAWSBaseConstruct } from "../types/astro-aws-construct.js"

import {
	AstroAWSS3BucketDeployment,
	type AstroAWSS3BucketDeploymentCdk,
	type AstroAWSS3BucketDeploymentCdkProps,
} from "./astro-aws-s3-bucket-deployment.js"
import {
	AstroAWSS3Bucket,
	type AstroAWSS3BucketCdk,
	type AstroAWSS3BucketCdkProps,
} from "./astro-aws-s3-bucket.js"
import {
	type AstroAWSOriginCdkProps,
	AstroAWSOrigin,
	type AstroAWSOriginCdk,
} from "./astro-aws-origin.js"
import type {
	AstroAWSCloudfrontDistributionCdk,
	AstroAWSCloudfrontDistributionCdkProps,
} from "./astro-aws-cloudfront-distribution.js"
import { AstroAWSCloudfrontDistribution } from "./astro-aws-cloudfront-distribution.js"

type AstroAWSCdkProps = {
	lambdaFunction?: Omit<FunctionProps, "code" | "handler">
}

type AstroAWSProps = {
	/** Passed through to the Bucket Origin. */
	websiteDir?: string
	outDir?: string
	cdk?: AstroAWSCdkProps &
		AstroAWSCloudfrontDistributionCdkProps &
		AstroAWSOriginCdkProps &
		AstroAWSS3BucketCdkProps &
		AstroAWSS3BucketDeploymentCdkProps
}

type AstroAWSCdk = AstroAWSCloudfrontDistributionCdk &
	AstroAWSOriginCdk &
	AstroAWSS3BucketCdk &
	AstroAWSS3BucketDeploymentCdk & {
		lambdaFunction?: Function
	}

/**
 * Constructs the required AWS resources to deploy an Astro website. The resources are:
 *
 * - S3 bucket to host the website assets
 * - Lambda function to handle the requests (if "server" output)
 * - CloudFront distribution to serve the website
 * - Origin access identity to restrict access to the S3 bucket
 *
 * If "server" output is selected, this works by routing requests to the Lambda function. If the Lambda function returns
 * a 404 response, the Cloudfront distribution falls back to the S3 bucket.
 */
class AstroAWS extends AstroAWSBaseConstruct<AstroAWSProps, AstroAWSCdk> {
	#lambdaFunction?: Function
	#astroAWSS3BucketDeployment: AstroAWSS3BucketDeployment
	#astroAWSS3Bucket: AstroAWSS3Bucket
	#astroAWSOrigin: AstroAWSOrigin
	#astroAWSCloudfrontDistribution: AstroAWSCloudfrontDistribution

	public constructor(scope: Construct, id: string, props: AstroAWSProps) {
		super(scope, id, props)

		this.#astroAWSS3Bucket = new AstroAWSS3Bucket(
			this,
			"AstroAWSS3Bucket",
			this.props,
		)

		if (this.isSSR) {
			this.createSSROnlyResources()
		}

		this.#astroAWSOrigin = new AstroAWSOrigin(this, "AstroAWSOrigin", {
			...this.props,
			lambdaFunction: this.#lambdaFunction,
			s3Bucket: this.#astroAWSS3Bucket.cdk.s3Bucket,
		})

		this.#astroAWSCloudfrontDistribution = new AstroAWSCloudfrontDistribution(
			this,
			"AstroAWSCloudfrontDistribution",
			{
				...this.props,
				lambdaFunction: this.#lambdaFunction,
				lambdaFunctionOrigin: this.#astroAWSOrigin.cdk.lambdaFunctionOrigin,
				origin: this.#astroAWSOrigin.cdk.origin,
			},
		)

		this.#astroAWSS3BucketDeployment = new AstroAWSS3BucketDeployment(
			this,
			"AstroAWSS3BucketDeployment",
			{
				...this.props,
				bucket: this.#astroAWSS3Bucket.cdk.s3Bucket,
				distribution:
					this.#astroAWSCloudfrontDistribution.cdk.cloudfrontDistribution,
			},
		)
	}

	public get cdk(): AstroAWSCdk {
		return {
			...this.#astroAWSS3BucketDeployment.cdk,
			...this.#astroAWSS3Bucket.cdk,
			...this.#astroAWSOrigin.cdk,
			...this.#astroAWSCloudfrontDistribution.cdk,
			lambdaFunction: this.#lambdaFunction,
		}
	}

	private createSSROnlyResources() {
		const {
			environment = {},
			architecture,
			runtime = Runtime.NODEJS_18_X,
			memorySize = 512,
			description = "SSR Lambda Function",
			...givenProps
		} = this.props.cdk?.lambdaFunction ?? {}

		this.#lambdaFunction = new Function(this, "Function", {
			...givenProps,
			architecture:
				this.metadata?.args.mode === "edge"
					? Architecture.X86_64
					: architecture,
			code: Code.fromAsset(resolve(this.distDir, "lambda")),
			description,
			handler: "entry.handler",
			memorySize,
			runtime,
		})

		Object.entries(environment).forEach(([key, value]) => {
			this.#lambdaFunction?.addEnvironment(key, value, {
				removeInEdge: true,
			})
		})
	}
}

export { type AstroAWSCdkProps, type AstroAWSProps, type AstroAWSCdk, AstroAWS }
