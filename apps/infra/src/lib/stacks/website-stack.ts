import { env } from "node:process";

import { Stack, CfnOutput, Duration } from "aws-cdk-lib";
import type { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { AstroAWSConstruct } from "@astro-aws/constructs";
import type { Dashboard } from "aws-cdk-lib/aws-cloudwatch";
import type { IHostedZone } from "aws-cdk-lib/aws-route53";
import { AaaaRecord, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

import { DistributionMetric } from "../constructs/distribution-metric.js";
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js";
import { Environments } from "../constants/environments.js";
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js";

export type WebsiteStackProps = AstroAWSStackProps & {
	cloudwatchDashboard: Dashboard;
	certificate?: Certificate;
	hostedZone?: IHostedZone;
};

export class WebsiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: WebsiteStackProps) {
		super(scope, id, props);

		const { hostedZoneName, alias, cloudwatchDashboard, environment, output, certificate, hostedZone } = props;

		const domainName = [alias, hostedZoneName].filter(Boolean).join(".");
		const domainNames = [domainName].filter(Boolean);

		const astroAwsConstruct = new AstroAWSConstruct(this, "AstroAWSConstruct", {
			cloudfrontDistributionProps: {
				certificate,
				defaultBehavior: {
					responseHeadersPolicy: new ResponseHeadersPolicy(this, "ResponseHeadersPolicy", {
						securityHeadersBehavior: {
							contentSecurityPolicy: {
								contentSecurityPolicy: "default-src 'self'; upgrade-insecure-requests",
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
			lambdaFunctionProps: {
				architecture: Architecture.ARM_64,
			},
			node16: environment === Environments.DEV_NODE_16,
			outDir: `../www/dist/${output}`,
			output,
		});

		if (hostedZone) {
			new ARecord(this, "ARecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(new CloudFrontTarget(astroAwsConstruct.cloudfrontDistribution)),
				zone: hostedZone,
			});

			new AaaaRecord(this, "AaaaRecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(new CloudFrontTarget(astroAwsConstruct.cloudfrontDistribution)),
				zone: hostedZone,
			});
		}

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cloudfrontDistribution,
			label: "CloudFront 5xx error rate",
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		const distributionRequestsMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cloudfrontDistribution,
			label: "CloudFront requests",
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		});

		const widgets = [
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		];

		if (astroAwsConstruct.lambdaFunction) {
			const lambdaFailureRateMetric = astroAwsConstruct.lambdaFunction.metricErrors({
				label: "Lambda failure rate",
				period: Duration.minutes(5),
				statistic: "sum",
			});

			const lambdaInvocationsMetric = astroAwsConstruct.lambdaFunction.metricInvocations({
				label: "Lambda invocations",
				period: Duration.minutes(5),
				statistic: "sum",
			});

			const lambdaDurationMetric = astroAwsConstruct.lambdaFunction.metricDuration({
				label: "Lambda duration",
				period: Duration.minutes(5),
				statistic: "avg",
			});

			const lambdaThrottlesMetric = astroAwsConstruct.lambdaFunction.metricThrottles({
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
			value: astroAwsConstruct.cloudfrontDistribution.distributionId,
		});

		new CfnOutput(this, "CloudFrontDomainName", {
			value: astroAwsConstruct.cloudfrontDistribution.distributionDomainName,
		});
	}
}
