import * as cdk from "aws-cdk-lib";
import { Duration, StackProps } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import {
	CacheCookieBehavior,
	CacheHeaderBehavior,
	CachePolicy,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

import { AstroAWSConstruct } from "../constructs/astro-aws-construct";

export type InfraStackProps = StackProps & {
	hostedZoneId: string;
	hostedZoneName: string;
};

export class InfraStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: InfraStackProps) {
		super(scope, id, props);

		const { hostedZoneId, hostedZoneName } = props;

		const hostedZone = HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
			hostedZoneId,
			zoneName: hostedZoneName,
		});

		const certificate = new DnsValidatedCertificate(this, "Certificate", {
			domainName: hostedZoneName,
			hostedZone,
		});

		const astroAWSConstruct = new AstroAWSConstruct(this, "AstroAWSConstruct", {
			websitePath: "../www",
			lambdaProps: {
				architecture: Architecture.ARM_64,
				memorySize: 1024,
			},
			distributionProps: {
				certificate,
				defaultBehavior: {
					cachePolicy: new CachePolicy(this, "CachePolicy", {
						cachePolicyName: "AstroAwsCachePolicy",
						cookieBehavior: CacheCookieBehavior.all(),
						defaultTtl: Duration.days(1),
						enableAcceptEncodingBrotli: true,
						enableAcceptEncodingGzip: true,
						headerBehavior: CacheHeaderBehavior.none(),
						maxTtl: Duration.days(2),
						minTtl: Duration.seconds(2),
						queryStringBehavior: CacheQueryStringBehavior.all(),
					}),
				},
				domainNames: [hostedZoneName],
			},
		});

		new ARecord(this, "ARecord", {
			recordName: hostedZoneName,
			target: RecordTarget.fromAlias(new CloudFrontTarget(astroAWSConstruct.distribution)),
			zone: hostedZone,
		});

		new AaaaRecord(this, "AaaaRecord", {
			recordName: hostedZoneName,
			target: RecordTarget.fromAlias(new CloudFrontTarget(astroAWSConstruct.distribution)),
			zone: hostedZone,
		});
	}
}
