import {
	BlockPublicAccess,
	Bucket,
	BucketEncryption,
	type BucketProps,
} from "aws-cdk-lib/aws-s3"
import { type Construct } from "constructs"
import { OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront"
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam"

import { AstroAWSBaseConstruct } from "../types/astro-aws-construct.js"

export type AstroAWSS3BucketCdkProps = {
	s3Bucket?: Partial<BucketProps>
}

export type AstroAWSS3BucketProps = {
	cdk?: AstroAWSS3BucketCdkProps
}

export type AstroAWSS3BucketCdk = {
	originAccessIdentity: OriginAccessIdentity
	s3Bucket: Bucket
}

export class AstroAWSS3Bucket extends AstroAWSBaseConstruct<
	AstroAWSS3BucketProps,
	AstroAWSS3BucketCdk
> {
	#s3Bucket: Bucket
	#originAccessIdentity: OriginAccessIdentity

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
			...this.cdk.s3Bucket,
		})

		this.#originAccessIdentity = new OriginAccessIdentity(this, "S3BucketOAI", {
			comment: `OAI for ${id}`,
		})

		this.#s3Bucket.addToResourcePolicy(
			new PolicyStatement({
				actions: ["s3:GetObject"],
				principals: [
					new CanonicalUserPrincipal(
						this.#originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId,
					).grantPrincipal,
				],
				resources: [this.#s3Bucket.arnForObjects("*")],
			}),
		)
	}

	public get cdk() {
		return {
			originAccessIdentity: this.#originAccessIdentity,
			s3Bucket: this.#s3Bucket,
		}
	}
}
