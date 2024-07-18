import * as path from "node:path"

import { RemovalPolicy, Stack } from "aws-cdk-lib/core"
import {
	CloudFrontWebDistribution,
	Distribution,
	Function,
	FunctionCode,
	FunctionEventType,
	OriginProtocolPolicy,
	PriceClass,
	ViewerCertificate,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import type { Construct } from "constructs"
import {
	AaaaRecord,
	ARecord,
	HostedZone,
	RecordTarget,
} from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins"
import {
	BlockPublicAccess,
	Bucket,
	BucketEncryption,
	RedirectProtocol,
} from "aws-cdk-lib/aws-s3"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"
import { CrossRegionCertificate } from "../constructs/cross-region-certificate.js"

export type RedirectStackProps = AstroAWSStackProps & {
	hostedZoneName: string
	aliases: [string, ...string[]]
	targetAlias: string
}

export class RedirectStack extends Stack {
	public constructor(scope: Construct, id: string, props: RedirectStackProps) {
		super(scope, id, props)

		const { hostedZoneName, aliases } = props

		const domainNames = aliases.map((alias) =>
			[alias, hostedZoneName].filter(Boolean).join("."),
		) as [string, ...string[]]

		const wwwRedirectFunction = new Function(this, "WwwRedirectFunction", {
			code: FunctionCode.fromFile({
				filePath: path.resolve(".", "support", "redirect", "index.js"),
			}),
		})

		const [domainName, ...alternateNames] = domainNames
		const targetDomainName = [props.targetAlias, "astro-aws.org"]
			.filter(Boolean)
			.join(".")

		const { certificate } = new CrossRegionCertificate(this, "Certificate", {
			alternateNames,
			domainName,
			region: "us-east-1",
		})

		const bucket = new Bucket(this, "RedirectBucket", {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			removalPolicy: RemovalPolicy.DESTROY,
			versioned: true,
			websiteRedirect: {
				hostName: targetDomainName,
				protocol: RedirectProtocol.HTTPS,
			},
		})

		const distribution = new CloudFrontWebDistribution(
			this,
			"WWWRedirectDistribution",
			{
				defaultRootObject: "",
				originConfigs: [
					{
						behaviors: [{ isDefaultBehavior: true }],
						customOriginSource: {
							domainName: bucket.bucketWebsiteDomainName,
							originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
						},
					},
				],
				viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
					aliases: domainNames,
				}),
				comment: `Redirect to ${targetDomainName} from ${domainNames.join(
					", ",
				)}`,
				priceClass: PriceClass.PRICE_CLASS_ALL,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},
		)

		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: hostedZoneName,
		})

		domainNames.forEach((domain) => {
			new ARecord(this, `${domain}-ARecord`, {
				recordName: domain,
				target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
				zone: hostedZone,
			})

			new AaaaRecord(this, `${domain}-AaaaRecord`, {
				recordName: domain,
				target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
				zone: hostedZone,
			})
		})
	}
}
