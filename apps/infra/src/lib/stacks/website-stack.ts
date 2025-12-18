import { cwd, env } from "node:process"

import { DnsValidatedCertificate } from "@trautonen/cdk-dns-validated-certificate"
import { CfnOutput, Duration, Stack } from "aws-cdk-lib/core"
import type { ICertificate } from "aws-cdk-lib/aws-certificatemanager"
import {
	CacheCookieBehavior,
	CachePolicy,
	CacheQueryStringBehavior,
	PriceClass,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda"
import type { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { LogQueryWidget } from "aws-cdk-lib/aws-cloudwatch"
import type { ConcreteWidget, Dashboard } from "aws-cdk-lib/aws-cloudwatch"
import {
	AaaaRecord,
	ARecord,
	HostedZone,
	RecordTarget,
} from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"

import { DistributionMetric } from "../constructs/distribution-metric.js"
import { BasicGraphWidget } from "../constructs/basic-graph-widget.js"
import { Environments } from "../constants/environments.js"
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"
import { resolve } from "node:path"

type StaticWebsiteStackProps = {
	alias?: string
	mode: string
	hostedZoneName?: string
	app: string
	runtime: string
}

type WebsiteStackProps = AstroAWSStackProps &
	StaticWebsiteStackProps & {
		cloudwatchDashboard?: Dashboard
	}

class WebsiteStack extends Stack {
	public readonly astroAWS: AstroAWS
	public constructor(scope: Construct, id: string, props: WebsiteStackProps) {
		super(scope, id, props)

		const self = this

		const {
			alias,
			cloudwatchDashboard,
			mode,
			environment,
			hostedZoneName,
			runtime,
		} = props

		const { domainNames, certificate, hostedZone } = getDNS()

		const distDir = mode === "static" ? "dist" : `dist/${mode}`

		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			cookieBehavior: CacheCookieBehavior.all(),
			minTtl: Duration.days(365),
			queryStringBehavior: CacheQueryStringBehavior.all(),
		})

		const astroAwsConstruct = new AstroAWS(this, "AstroAWSConstruct", {
			cdk: {
				cloudfrontDistribution: {
					apiBehavior: {
						cachePolicy,
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
					certificate,
					comment: `${environment} - ${mode} - ${runtime}`,
					defaultBehavior: {
						cachePolicy,
						responseHeadersPolicy: new ResponseHeadersPolicy(
							this,
							"ResponseHeadersPolicy",
							{
								securityHeadersBehavior: {
									contentSecurityPolicy: {
										contentSecurityPolicy:
											"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' cognito-identity.us-east-1.amazonaws.com dataplane.rum.us-east-1.amazonaws.com; upgrade-insecure-requests",
										override: true,
									},
								},
							},
						),
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
					domainNames,
					errorResponses: [
						{
							httpStatus: 403,
							responsePagePath: "/403",
						},
					],
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
					architecture: Architecture.ARM_64,
					environment: {
						DOMAIN: String(domainNames?.[0]),
					},
					runtime: new Runtime(`${runtime}.x`),
				},
			},
			outDir: resolve(cwd(), "..", "..", props.app, distDir),
		})

		if (hostedZone && domainNames?.length) {
			domainNames.forEach((domainName) => {
				new ARecord(this, `ARecord-${domainName}`, {
					recordName: domainName,
					target: RecordTarget.fromAlias(
						new CloudFrontTarget(astroAwsConstruct.cdk.cloudfrontDistribution),
					),
					zone: hostedZone,
				})

				new AaaaRecord(this, `AaaaRecord-${domainName}`, {
					recordName: domainName,
					target: RecordTarget.fromAlias(
						new CloudFrontTarget(astroAwsConstruct.cdk.cloudfrontDistribution),
					),
					zone: hostedZone,
				})
			})
		}

		const distribution5xxErrorRateMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cdk.cloudfrontDistribution,
			label: `${mode.toUpperCase()} - CloudFront 5xx error rate`,
			metricName: "5xxErrorRate",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		const distributionRequestsMetric = new DistributionMetric({
			distribution: astroAwsConstruct.cdk.cloudfrontDistribution,
			label: `${mode.toUpperCase()} - CloudFront requests`,
			metricName: "Requests",
			period: Duration.minutes(5),
			statistic: "Sum",
		})

		const widgets: ConcreteWidget[] = [
			new BasicGraphWidget({ metric: distribution5xxErrorRateMetric }),
			new BasicGraphWidget({ metric: distributionRequestsMetric }),
		]

		if (astroAwsConstruct.cdk.lambdaFunction) {
			const lambdaLogQueryWidget = new LogQueryWidget({
				height: 12,
				logGroupNames: [
					astroAwsConstruct.cdk.lambdaFunction.logGroup.logGroupName,
				],
				queryLines: ["fields @timestamp, @message", "sort @timestamp desc"],
				title: `${mode.toUpperCase()} - Lambda logs`,
				width: 24,
			})

			const lambdaFailureRateMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricErrors({
					label: `${mode.toUpperCase()} - Lambda failure rate`,
					period: Duration.minutes(5),
					statistic: "sum",
				})

			const lambdaInvocationsMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricInvocations({
					label: `${mode.toUpperCase()} - Lambda invocations`,
					period: Duration.minutes(5),
					statistic: "sum",
				})

			const lambdaDurationMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricDuration({
					label: `${mode.toUpperCase()} - Lambda duration`,
					period: Duration.minutes(5),
					statistic: "avg",
				})

			const lambdaThrottlesMetric =
				astroAwsConstruct.cdk.lambdaFunction.metricThrottles({
					label: `${mode.toUpperCase()} - Lambda throttles`,
					period: Duration.minutes(5),
					statistic: "sum",
				})

			widgets.unshift(lambdaLogQueryWidget)

			widgets.push(
				new BasicGraphWidget({ metric: lambdaFailureRateMetric }),
				new BasicGraphWidget({ metric: lambdaInvocationsMetric }),
				new BasicGraphWidget({ metric: lambdaDurationMetric }),
				new BasicGraphWidget({ metric: lambdaThrottlesMetric }),
			)
		}

		cloudwatchDashboard?.addWidgets(...widgets)

		new CfnOutput(this, "CloudFrontDistributionId", {
			value: astroAwsConstruct.cdk.cloudfrontDistribution.distributionId,
		})

		new CfnOutput(this, "CloudFrontDomainName", {
			value:
				astroAwsConstruct.cdk.cloudfrontDistribution.distributionDomainName,
		})

		if (domainNames?.[0]) {
			new CfnOutput(this, "DomainName", {
				value: domainNames[0],
			})
		}

		this.astroAWS = astroAwsConstruct

		function getDNS() {
			if (!alias || !hostedZoneName) {
				return {
					hostedZone: undefined,
					domainNames: undefined,
					certificate: undefined,
				}
			}

			const hostedZone = HostedZone.fromLookup(self, "HostedZone", {
				domainName: hostedZoneName,
			})

			const domainName = `${alias}.${hostedZoneName}`
			const domainNames = [domainName]

			const certificate = new DnsValidatedCertificate(self, "Certificate", {
				domainName,
				validationHostedZones: [{ hostedZone }],
				certificateRegion: "us-east-1",
			})

			return { hostedZone, domainNames, certificate }
		}
	}
}

export { type StaticWebsiteStackProps, type WebsiteStackProps, WebsiteStack }
