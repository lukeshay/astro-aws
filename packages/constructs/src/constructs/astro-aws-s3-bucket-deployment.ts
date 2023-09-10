import { resolve } from "node:path"

import {
	BucketDeployment,
	Source,
	type BucketDeploymentProps,
} from "aws-cdk-lib/aws-s3-deployment"
import { type Construct } from "constructs"
import { type Distribution } from "aws-cdk-lib/aws-cloudfront"

import { type Output } from "../types/output.js"
import { AstroAWSBaseConstruct } from "../types/astro-aws-construct.js"

export type AstroAWSS3BucketDeploymentCdkProps = {
	s3BucketDeployment?: Partial<
		Omit<BucketDeploymentProps, "destinationBucket" | "distribution">
	>
}

export type AstroAWSS3BucketDeploymentProps = {
	distDir: string
	output: Output
	bucket: BucketDeploymentProps["destinationBucket"]
	distribution: Distribution
	cdk?: AstroAWSS3BucketDeploymentCdkProps
}

export type AstroAWSS3BucketDeploymentCdk = {
	s3BucketDeployment: BucketDeployment
}

export class AstroAWSS3BucketDeployment extends AstroAWSBaseConstruct<
	AstroAWSS3BucketDeploymentProps,
	AstroAWSS3BucketDeploymentCdk
> {
	#s3BucketDeployment: BucketDeployment

	public constructor(
		scope: Construct,
		id: string,
		props: AstroAWSS3BucketDeploymentProps,
	) {
		super(scope, id, props)

		const { output, distDir, bucket, cdk = {}, distribution } = this.props

		const source = ["server", "edge"].includes(output)
			? resolve(distDir, "client")
			: resolve(distDir)

		this.#s3BucketDeployment = new BucketDeployment(this, "BucketDeployment", {
			...cdk.s3BucketDeployment,
			destinationBucket: bucket,
			distribution,
			sources: [
				Source.asset(source),
				...(cdk.s3BucketDeployment?.sources ?? []),
			],
		})
	}

	public get cdk() {
		return {
			s3BucketDeployment: this.#s3BucketDeployment,
		}
	}
}
