import type { StackProps } from "aws-cdk-lib";
import { Stack, CfnOutput, Duration } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { AstroAWSConstruct } from "@astro-aws/constructs";
import type { Dashboard } from "aws-cdk-lib/aws-cloudwatch";

import { DistributionMetric } from "../constructs/distribution-metric.js";
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js";

export type WebsiteStackProps = StackProps & {
	domainName?: string;
	env: StackProps["env"];
	cloudwatchDashboard: Dashboard;
};

export class WebsiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: WebsiteStackProps) {
		super(scope, id, props);

		const { domainName, cloudwatchDashboard } = props;

		let certificate: Certificate | undefined;

		if (domainName) {
			certificate = new Certificate(this, "Certificate", {
				domainName,
			});
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
				domainNames: domainName ? [domainName] : [],
			},
			lambdaProps: {
				architecture: Architecture.ARM_64,
				memorySize: 1024,
			},
			websitePath: "../www",
		});

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

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution: astroAwsConstruct.distribution,
			label: "CloudFront 5xx error rate",
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		const distributionRequestsMetric = new DistributionMetric({
			distribution: astroAwsConstruct.distribution,
			label: "CloudFront 5xx error rate",
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		cloudwatchDashboard.addWidgets(
			new BasicGraphWidget({ metric: lambdaFailureRateMetric }),
			new BasicGraphWidget({ metric: lambdaInvocationsMetric }),
			new BasicGraphWidget({ metric: lambdaDurationMetric }),
			new BasicGraphWidget({ metric: lambdaThrottlesMetric }),
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		);

		new CfnOutput(this, "CloudFrontDistributionId", {
			value: astroAwsConstruct.distribution.distributionId,
		});

		new CfnOutput(this, "CloudFrontDomainName", {
			value: astroAwsConstruct.distribution.distributionDomainName,
		});
	}
}
