import { env } from "node:process"

import { CfnOutput, Duration, Stack } from "aws-cdk-lib/core"
import type { Certificate } from "aws-cdk-lib/aws-certificatemanager"
import {
	CachePolicy,
	PriceClass,
	ResponseHeadersPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { Architecture } from "aws-cdk-lib/aws-lambda"
import type { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import type { Dashboard } from "aws-cdk-lib/aws-cloudwatch"
import type { IHostedZone } from "aws-cdk-lib/aws-route53"
import { AaaaRecord, ARecord, RecordTarget } from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import {
	BlockPublicAccess,
	Bucket,
	BucketAccessControl,
	BucketEncryption,
} from "aws-cdk-lib/aws-s3"

import { DistributionMetric } from "../constructs/distribution-metric.js"
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js"
import { Environments } from "../constants/environments.js"
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"

export type WebsiteStackProps = AstroAWSStackProps & {
	cloudwatchDashboard: Dashboard
	certificate?: Certificate
	hostedZone?: IHostedZone
}

export class WebsiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: WebsiteStackProps) {
		super(scope, id, props)

		const {
			hostedZoneName,
			alias,
			cloudwatchDashboard,
			environment,
			output,
			certificate,
			hostedZone,
		} = props

		const domainName = [alias, hostedZoneName].filter(Boolean).join(".")
		const domainNames = [domainName].filter(Boolean)

		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			minTtl: Duration.days(365),
		})

		// const cfLogInjestFunction = Function.fromFunctionAttributes(this, "CfLogInjestLambda", {
		// 	architecture: Architecture.ARM_64,
		// 	functionArn: "arn:aws:lambda:us-east-1:738697399292:function:CfLogIngestStack-LambdaD247545B-IHTgL5hMPXUT",
		// 	sameEnvironment: false,
		// });

		const accessLogBucket = new Bucket(this, "AccessLogBucket", {
			accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
		})

		// accessLogBucket.addObjectCreatedNotification(new LambdaDestination(cfLogInjestFunction), {
		// 	prefix: "cloudfront/",
		// });

		const astroAwsConstruct = new AstroAWS(this, "AstroAWSConstruct", {
			cdk: {
				cloudfrontDistribution: {
					certificate,
					comment: environment,
					defaultBehavior: {
						cachePolicy,
						responseHeadersPolicy: new ResponseHeadersPolicy(
							this,
							"ResponseHeadersPolicy",
							{
								securityHeadersBehavior: {
									contentSecurityPolicy: {
										contentSecurityPolicy:
											"default-src 'self'; upgrade-insecure-requests",
										override: true,
									},
								},
							},
						),
					},
					domainNames,
					errorResponses: [
						{
							httpStatus: 403,
							responsePagePath: "/403",
						},
					],
					logBucket: accessLogBucket,
					logFilePrefix: "cloudfront/",
					priceClass:
						environment === Environments.PROD
							? PriceClass.PRICE_CLASS_ALL
							: PriceClass.PRICE_CLASS_100,
					webAclId:
						env.WEB_ACL_ARN && env.WEB_ACL_ARN.length > 0
							? env.WEB_ACL_ARN
							: undefined,
				},
				lambdaFunction: {
					architecture:
						output === "edge" ? Architecture.X86_64 : Architecture.ARM_64,
				},
				s3Bucket: {
					serverAccessLogsBucket: accessLogBucket,
					serverAccessLogsPrefix: "s3/",
				},
			},
			outDir: `../www/dist/${output === "static" ? "static" : "server"}`,
			output,
		})

		if (hostedZone) {
			new ARecord(this, "ARecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAwsConstruct.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})

			new AaaaRecord(this, "AaaaRecord", {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAwsConstruct.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})
		}

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cdk.cloudfrontDistribution,
			label: "CloudFront 5xx error rate",
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		const distributionRequestsMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cdk.cloudfrontDistribution,
			label: "CloudFront requests",
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		const widgets = [
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		]

		if (astroAwsConstruct.cdk.lambdaFunction) {
			const lambdaFailureRateMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricErrors({
					label: "Lambda failure rate",
					period: Duration.minutes(5),
					statistic: "sum",
				})

			const lambdaInvocationsMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricInvocations({
					label: "Lambda invocations",
					period: Duration.minutes(5),
					statistic: "sum",
				})

			const lambdaDurationMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricDuration({
					label: "Lambda duration",
					period: Duration.minutes(5),
					statistic: "avg",
				})

			const lambdaThrottlesMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricThrottles({
					label: "Lambda throttles",
					period: Duration.minutes(5),
					statistic: "sum",
				})

			widgets.push(
				new BasicGraphWidget({ metric: lambdaFailureRateMetric }),
				new BasicGraphWidget({ metric: lambdaInvocationsMetric }),
				new BasicGraphWidget({ metric: lambdaDurationMetric }),
				new BasicGraphWidget({ metric: lambdaThrottlesMetric }),
			)
		}

		cloudwatchDashboard.addWidgets(...widgets)

		new CfnOutput(this, "CloudFrontDistributionId", {
			value: astroAwsConstruct.cdk.cloudfrontDistribution.distributionId,
		})

		new CfnOutput(this, "CloudFrontDomainName", {
			value:
				astroAwsConstruct.cdk.cloudfrontDistribution.distributionDomainName,
		})
	}
}
