import {
	BlockPublicAccess,
	Bucket,
	BucketEncryption,
	type BucketProps,
} from "aws-cdk-lib/aws-s3"
import { type Construct } from "constructs"
import { type OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront"

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
	/**
	 * @deprecated Origin Access Identity is no longer used. CloudFront Origin Access Control (OAC)
	 * is now used instead. This field always returns `undefined` and will be removed in a future
	 * major version.
	 */
	originAccessIdentity: OriginAccessIdentity | undefined
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
			originAccessIdentity: undefined as OriginAccessIdentity | undefined,
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
