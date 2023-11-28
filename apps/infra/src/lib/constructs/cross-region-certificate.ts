// eslint-disable-next-line max-classes-per-file
import * as path from "node:path"

import { Stack, CustomResource, Duration } from "aws-cdk-lib/core"
import { Provider } from "aws-cdk-lib/custom-resources"
import { Construct } from "constructs"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { PolicyStatement } from "aws-cdk-lib/aws-iam"
import {
	Certificate,
	type ICertificate,
} from "aws-cdk-lib/aws-certificatemanager"

class CrossRegionCertificateProvider extends Construct {
	private readonly provider: Provider

	public constructor(scope: Construct, id: string) {
		super(scope, id)

		const onEventHandler = new Function(
			this,
			"CrossRegionCertificateProviderEventHandler",
			{
				code: Code.fromAsset(
					path.resolve(".", "support", "cross-region-certificate"),
				),
				handler: "index.onEvent",
				initialPolicy: [
					new PolicyStatement({
						actions: ["acm:RequestCertificate", "acm:DeleteCertificate"],
						resources: ["*"],
					}),
				],
				runtime: Runtime.NODEJS_20_X,
			},
		)

		const isCompleteHandler = new Function(
			this,
			"CrossRegionCertificateProviderCompleteHandler",
			{
				code: Code.fromAsset(
					path.resolve(".", "support", "cross-region-certificate"),
				),
				handler: "index.isComplete",
				initialPolicy: [
					new PolicyStatement({
						actions: ["acm:DescribeCertificate"],
						resources: ["*"],
					}),
				],
				runtime: Runtime.NODEJS_20_X,
			},
		)

		this.provider = new Provider(this, "CrossRegionCertificateProvider", {
			isCompleteHandler,
			onEventHandler,
			queryInterval: Duration.seconds(15),
			totalTimeout: Duration.minutes(20),
		})
	}

	public static getOrCreate(scope: Construct) {
		const stack = Stack.of(scope)
		const id =
			"org.astro-aws.cdk.custom-resources.cross-region-certificate-provider"
		const x =
			(stack.node.tryFindChild(id) as
				| CrossRegionCertificateProvider
				| undefined) ?? new CrossRegionCertificateProvider(stack, id)

		return x.provider.serviceToken
	}
}

type CerticateStatus =
	| "EXPIRED"
	| "FAILED"
	| "INACTIVE"
	| "ISSUED"
	| "PENDING_VALIDATION"
	| "REVOKED"
	| "VALIDATION_TIMED_OUT"
	| undefined

type CrossRegionCertificateProperties = {
	domainName: string
	alternateNames?: string[]
	region?: string
}

class CrossRegionCertificate extends Construct {
	public readonly certificateArn: string
	public readonly domainName: string
	public readonly alternateNames: string[]
	public readonly region: string
	public readonly status: CerticateStatus
	public readonly certificate: ICertificate

	public constructor(
		scope: Construct,
		id: string,
		properties: CrossRegionCertificateProperties,
	) {
		super(scope, id)

		const resource = new CustomResource(this, "Resource", {
			properties: {
				alternateNames: properties.alternateNames ?? [],
				domainName: properties.domainName,
				idempotenceToken: this.node.addr,
				region: properties.region ?? Stack.of(this).region,
			},
			resourceType: "Custom::CrossRegionCertificate",
			serviceToken: CrossRegionCertificateProvider.getOrCreate(this),
		})

		this.certificateArn = resource.getAttString("certificateArn")
		this.domainName = resource.getAttString("domainName")
		this.alternateNames = resource.getAtt("alternateNames").toStringList()
		this.region = resource.getAttString("region")
		this.status = resource.getAttString("status") as CerticateStatus
		this.certificate = Certificate.fromCertificateArn(
			this,
			"Certificate",
			this.certificateArn,
		)
	}
}

export {
	type CrossRegionCertificateProperties,
	type CerticateStatus,
	CrossRegionCertificate,
}
