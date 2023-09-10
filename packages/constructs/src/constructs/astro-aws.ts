import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

import {
	type FunctionProps,
	Code,
	Function,
	Runtime,
} from "aws-cdk-lib/aws-lambda"
import { type Construct } from "constructs"

import { type Output } from "../types/output.js"
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

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export type AstroAWSCdkProps = {
	lambdaFunction?: Omit<FunctionProps, "code" | "handler" | "runtime">
}

export type AstroAWSProps = {
	/** Passed through to the Bucket Origin. */
	websiteDir?: string
	outDir?: string
	output: Output
	node16?: boolean
	cdk?: AstroAWSCdkProps &
		AstroAWSCloudfrontDistributionCdkProps &
		AstroAWSOriginCdkProps &
		AstroAWSS3BucketCdkProps &
		AstroAWSS3BucketDeploymentCdkProps
}

export type AstroAWSCdk = AstroAWSCloudfrontDistributionCdk &
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
export class AstroAWS extends AstroAWSBaseConstruct<
	AstroAWSProps,
	AstroAWSCdk
> {
	public readonly distDir: string

	#lambdaFunction?: Function
	#astroAWSS3BucketDeployment: AstroAWSS3BucketDeployment
	#astroAWSS3Bucket: AstroAWSS3Bucket
	#astroAWSOrigin: AstroAWSOrigin
	#astroAWSCloudfrontDistribution: AstroAWSCloudfrontDistribution

	public constructor(scope: Construct, id: string, props: AstroAWSProps) {
		super(scope, id, props)

		const { outDir, websiteDir = __dirname, output } = props

		this.#astroAWSS3Bucket = new AstroAWSS3Bucket(this, "AstroAWSS3Bucket", {
			cdk: this.props.cdk,
		})

		this.distDir = outDir ? resolve(outDir) : resolve(websiteDir, "dist")

		if (["server", "edge"].includes(output)) {
			this.createSSROnlyResources()
		}

		this.#astroAWSOrigin = new AstroAWSOrigin(this, "AstroAWSOrigin", {
			cdk: this.props.cdk,
			lambdaFunction: this.#lambdaFunction,
			output,
			s3Bucket: this.#astroAWSS3Bucket.cdk.s3Bucket,
		})

		this.#astroAWSCloudfrontDistribution = new AstroAWSCloudfrontDistribution(
			this,
			"AstroAWSCloudfrontDistribution",
			{
				cdk: this.props.cdk,
				lambdaFunction: this.#lambdaFunction,
				lambdaFunctionOrigin: this.#astroAWSOrigin.cdk.lambdaFunctionOrigin,
				origin: this.#astroAWSOrigin.cdk.origin,
				output,
			},
		)

		this.#astroAWSS3BucketDeployment = new AstroAWSS3BucketDeployment(
			this,
			"AstroAWSS3BucketDeployment",
			{
				bucket: this.#astroAWSS3Bucket.cdk.s3Bucket,
				cdk: this.props.cdk,
				distDir: this.distDir,
				distribution:
					this.#astroAWSCloudfrontDistribution.cdk.cloudfrontDistribution,
				output: this.props.output,
			},
		)
	}

	private createSSROnlyResources() {
		this.#lambdaFunction = new Function(this, "Function", {
			description: "SSR Lambda Function",
			memorySize: 512,
			runtime: this.props.node16 ? Runtime.NODEJS_16_X : Runtime.NODEJS_18_X,
			...this.props.cdk?.lambdaFunction,
			code: Code.fromAsset(resolve(this.distDir, "lambda")),
			handler: "entry.handler",
		})
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
}
