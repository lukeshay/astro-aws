import { resolve } from "node:path"

import {
	BucketDeployment,
	Source,
	type BucketDeploymentProps,
} from "aws-cdk-lib/aws-s3-deployment"
import { type Construct } from "constructs"
import { type Distribution } from "aws-cdk-lib/aws-cloudfront"

import {
	AstroAWSBaseConstruct,
	type AstroAWSBaseConstructProps,
} from "../types/astro-aws-construct.js"

type AstroAWSS3BucketDeploymentCdkProps = {
	s3BucketDeployment?: Partial<
		Omit<BucketDeploymentProps, "destinationBucket" | "distribution">
	>
}

type AstroAWSS3BucketDeploymentProps = AstroAWSBaseConstructProps & {
	bucket: BucketDeploymentProps["destinationBucket"]
	cdk?: AstroAWSS3BucketDeploymentCdkProps
	distribution: Distribution
}

type AstroAWSS3BucketDeploymentCdk = {
	s3BucketDeployment: BucketDeployment
}

class AstroAWSS3BucketDeployment extends AstroAWSBaseConstruct<
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

		const { bucket, cdk = {}, distribution } = this.props

		const source = this.metadata
			? resolve(this.distDir, "client")
			: resolve(this.distDir)

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

export {
	type AstroAWSS3BucketDeploymentCdkProps,
	type AstroAWSS3BucketDeploymentProps,
	type AstroAWSS3BucketDeploymentCdk,
	AstroAWSS3BucketDeployment,
}
