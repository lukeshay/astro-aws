import { env } from "node:process";

import { Stack, CfnOutput, Duration } from "aws-cdk-lib";
import type { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { AstroAWSConstruct } from "@astro-aws/constructs";
import type { Dashboard } from "aws-cdk-lib/aws-cloudwatch";
import type { IHostedZone } from "aws-cdk-lib/aws-route53";
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

import { DistributionMetric } from "../constructs/distribution-metric.js";
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js";
import { Environments } from "../constants/environments.js";
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js";

export type WebsiteStackProps = AstroAWSStackProps & {
	cloudwatchDashboard: Dashboard;
};

export class WebsiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: WebsiteStackProps) {
		super(scope, id, props);

		const { hostedZoneName, alias, hostedZoneId, cloudwatchDashboard, environment, output } = props;

		const domainName = [alias, hostedZoneName].filter(Boolean).join(".");
		const domainNames = [domainName].filter(Boolean);

		let certificate: Certificate | undefined, hostedZone: IHostedZone | undefined;

		if (hostedZoneName && hostedZoneId) {
			const theHostedZone = HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
				hostedZoneId,
				zoneName: hostedZoneName,
			});

			certificate = new DnsValidatedCertificate(this, "Certificate", {
				domainName,
				hostedZone: theHostedZone,
			});

			hostedZone = theHostedZone;
		}

		const astroAwsConstruct = new AstroAWSConstruct(this, "AstroAWSConstruct", {
			distributionProps: {
				certificate,
				defaultBehavior: {
					responseHeadersPolicy: new ResponseHeadersPolicy(this, "ResponseHeadersPolicy", {
						securityHeadersBehavior: {
							contentSecurityPolicy: {
								contentSecurityPolicy:
									"default-src 'none'; img-src 'self'; prefetch-src 'self'; upgrade-insecure-requests",
								override: true,
							},
						},
					}),
				},
				domainNames,
				errorResponses: [
					{
						httpStatus: 403,
						responsePagePath: "/403",
					},
				],
				webAclId: env.WEB_ACL_ARN && env.WEB_ACL_ARN.length > 0 ? env.WEB_ACL_ARN : undefined,
			},
			lambdaProps: {
				architecture: Architecture.ARM_64,
				memorySize: 512,
			},
			node16: environment === Environments.DEV_NODE_16,
			outDir: `../www/dist/${output}`,
			output,
		});

		if (hostedZone) {
			new ARecord(this, "ARecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(new CloudFrontTarget(astroAwsConstruct.distribution)),
				zone: hostedZone,
			});

			new AaaaRecord(this, "AaaaRecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(new CloudFrontTarget(astroAwsConstruct.distribution)),
				zone: hostedZone,
			});
		}

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution: astroAwsConstruct.distribution,
			label: "CloudFront 5xx error rate",
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		const distributionRequestsMetric = new DistributionMetric({
			distribution: astroAwsConstruct.distribution,
			label: "CloudFront requests",
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		const widgets = [
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		];

		if (astroAwsConstruct.lambda) {
			const lambdaFailureRateMetric = astroAwsConstruct.lambda.metricErrors({
				label: "Lambda failure rate",
				period: Duration.minutes(5),
				statistic: "sum",
			});

			const lambdaInvocationsMetric = astroAwsConstruct.lambda.metricInvocations({
				label: "Lambda invocations",
				period: Duration.minutes(5),
				statistic: "sum",
			});

			const lambdaDurationMetric = astroAwsConstruct.lambda.metricDuration({
				label: "Lambda duration",
				period: Duration.minutes(5),
				statistic: "avg",
			});

			const lambdaThrottlesMetric = astroAwsConstruct.lambda.metricThrottles({
				label: "Lambda throttles",
				period: Duration.minutes(5),
				statistic: "sum",
			});

			widgets.push(
				new BasicGraphWidget({ metric: lambdaFailureRateMetric }),
				new BasicGraphWidget({ metric: lambdaInvocationsMetric }),
				new BasicGraphWidget({ metric: lambdaDurationMetric }),
				new BasicGraphWidget({ metric: lambdaThrottlesMetric }),
			);
		}

		cloudwatchDashboard.addWidgets(...widgets);

		new CfnOutput(this, "CloudFrontDistributionId", {
			value: astroAwsConstruct.distribution.distributionId,
		});

		new CfnOutput(this, "CloudFrontDomainName", {
			value: astroAwsConstruct.distribution.distributionDomainName,
		});
	}
}
