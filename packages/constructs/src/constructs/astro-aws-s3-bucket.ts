import {
	BlockPublicAccess,
	Bucket,
	BucketEncryption,
	type BucketProps,
} from "aws-cdk-lib/aws-s3"
import { type Construct } from "constructs"

import {
	AstroAWSBaseConstruct,
	type AstroAWSBaseConstructProps,
} from "../types/astro-aws-construct.js"

type AstroAWSS3BucketCdkProps = {
	s3Bucket?: Partial<BucketProps>
}

type AstroAWSS3BucketProps = AstroAWSBaseConstructProps & {
	cdk?: AstroAWSS3BucketCdkProps
}

type AstroAWSS3BucketCdk = {
	s3Bucket: Bucket
}

class AstroAWSS3Bucket extends AstroAWSBaseConstruct<
	AstroAWSS3BucketProps,
	AstroAWSS3BucketCdk
> {
	#s3Bucket: Bucket

	public constructor(
		scope: Construct,
		id: string,
		props: AstroAWSS3BucketProps,
	) {
		super(scope, id, props)

		this.#s3Bucket = new Bucket(this, "S3Bucket", {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			...props.cdk?.s3Bucket,
		})
	}

	public get cdk() {
		return {
			s3Bucket: this.#s3Bucket,
		}
	}
}

export {
	type AstroAWSS3BucketCdkProps,
	type AstroAWSS3BucketProps,
	type AstroAWSS3BucketCdk,
	AstroAWSS3Bucket,
}
