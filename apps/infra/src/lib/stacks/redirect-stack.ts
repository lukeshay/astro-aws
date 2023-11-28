import * as path from "node:path"

import { Stack } from "aws-cdk-lib/core"
import {
	Distribution,
	Function,
	FunctionCode,
	FunctionEventType,
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
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"
import { CrossRegionCertificate } from "../constructs/cross-region-certificate.js"

export type RedirectStackProps = AstroAWSStackProps & {
	hostedZoneName: string
	aliases: [string, ...string[]]
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

		const { certificate } = new CrossRegionCertificate(this, "Certificate", {
			alternateNames,
			domainName,
			region: "us-east-1",
		})

		const bucket = new Bucket(this, "RedirectBucket", {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			versioned: true,
		})

		const distribution = new Distribution(this, "WWWRedirectDistribution", {
			certificate,
			defaultBehavior: {
				functionAssociations: [
					{
						eventType: FunctionEventType.VIEWER_REQUEST,
						function: wwwRedirectFunction,
					},
				],
				origin: new S3Origin(bucket),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},
			domainNames,
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
