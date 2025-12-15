import { RemovalPolicy, Stack } from "aws-cdk-lib/core"
import {
	Distribution,
	OriginProtocolPolicy,
	PriceClass,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins"
import type { Construct } from "constructs"
import {
	AaaaRecord,
	ARecord,
	HostedZone,
	RecordTarget,
} from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
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

		const distribution = new Distribution(this, "WWWRedirectDistribution", {
			defaultBehavior: {
				origin: new HttpOrigin(bucket.bucketWebsiteDomainName, {
					protocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
				}),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},
			certificate,
			domainNames,
			comment: `Redirect to ${targetDomainName} from ${domainNames.join(", ")}`,
			priceClass: PriceClass.PRICE_CLASS_ALL,
		})

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
