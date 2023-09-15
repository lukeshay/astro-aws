import { Stack, Duration } from "aws-cdk-lib/core"
import type { Certificate } from "aws-cdk-lib/aws-certificatemanager"
import {
	Distribution,
	Function,
	FunctionCode,
	FunctionEventType,
} from "aws-cdk-lib/aws-cloudfront"
import type { Construct } from "constructs"
import type { Dashboard } from "aws-cdk-lib/aws-cloudwatch"
import type { IHostedZone } from "aws-cdk-lib/aws-route53"
import { AaaaRecord, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import { HttpOrigin } from "aws-cdk-lib/aws-cloudfront-origins"

import { DistributionMetric } from "../constructs/distribution-metric.js"
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js"
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"

export type RedirectStackProps = AstroAWSStackProps & {
	cloudwatchDashboard: Dashboard
	certificate: Certificate
	hostedZone: IHostedZone
}

export class RedirectStack extends Stack {
	public constructor(scope: Construct, id: string, props: RedirectStackProps) {
		super(scope, id, props)

		const {
			hostedZoneName,
			alias,
			cloudwatchDashboard,
			hostedZone,
			certificate,
		} = props

		const domainName = [alias, hostedZoneName].filter(Boolean).join(".")

		const wwwRedirectFunction = new Function(this, "WwwRedirectFunction", {
			code: FunctionCode.fromInline(`
        function handler(event) {
          return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
              location: {
                value: "https://${domainName}" + event.request.uri,
              }
            }
          }
        }
      `),
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
				origin: new HttpOrigin(domainName.replace("www.", "")),
			},
			domainNames: [domainName],
		})

		new ARecord(this, "ARecord", {
			recordName: domainName,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
			zone: hostedZone,
		})

		new AaaaRecord(this, "AaaaRecord", {
			recordName: domainName,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
			zone: hostedZone,
		})

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution,
			label: "Redirect CloudFront 5xx error rate",
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		const distributionRequestsMetric = new DistributionMetric({
			distribution,
			label: "Redirect CloudFront requests",
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		cloudwatchDashboard.addWidgets(
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		)
	}
}
