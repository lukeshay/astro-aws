import { type Construct } from "constructs"
import { Version, type Function } from "aws-cdk-lib/aws-lambda"
import {
	AllowedMethods,
	Distribution,
	Function as CfFunction,
	FunctionCode,
	FunctionEventType,
	LambdaEdgeEventType,
	OriginRequestPolicy,
	ResponseHeadersPolicy,
	type BehaviorOptions,
	type DistributionProps,
	type EdgeLambda,
	type FunctionAssociation,
	type IOrigin,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"

import { AstroAWSBaseConstruct } from "../types/astro-aws-construct.js"
import { type Output } from "../types/output.js"

export type AstroAWSCloudfrontDistributionCdkProps = {
	cloudfrontDistribution?: Omit<
		DistributionProps,
		"apiBehavior" | "defaultBehavior"
	> & {
		defaultBehavior?: Omit<BehaviorOptions, "origin">
		apiBehavior?: Omit<BehaviorOptions, "origin">
	}
}

export type AstroAWSCloudfrontDistributionProps = {
	output: Output
	lambdaFunction?: Function
	origin: IOrigin
	lambdaFunctionOrigin?: IOrigin
	cdk?: AstroAWSCloudfrontDistributionCdkProps
}

export type AstroAWSCloudfrontDistributionCdk = {
	cloudfrontDistribution: Distribution
	redirectToIndexCloudfrontFunction?: CfFunction
}

export class AstroAWSCloudfrontDistribution extends AstroAWSBaseConstruct<
	AstroAWSCloudfrontDistributionProps,
	AstroAWSCloudfrontDistributionCdk
> {
	#redirectToIndexCloudfrontFunction?: CfFunction
	#cloudfrontDistribution: Distribution

	public constructor(
		scope: Construct,
		id: string,
		props: AstroAWSCloudfrontDistributionProps,
	) {
		super(scope, id, props)

		const functionAssociations: FunctionAssociation[] =
			this.props.cdk?.cloudfrontDistribution?.defaultBehavior
				?.functionAssociations ?? []

		if (this.props.output === "static") {
			this.#redirectToIndexCloudfrontFunction = new CfFunction(
				this,
				"RedirectToIndexFunction",
				{
					code: FunctionCode.fromInline(`
							function handler(event) {
								var request = event.request;
								var uri = request.uri;
						
								if (uri.endsWith("/")) {
									request.uri += "index.html";
								} else if (!uri.includes(".")) {
									request.uri += "/index.html";
								}
						
								return request;
						}
					`),
				},
			)

			functionAssociations.push({
				eventType: FunctionEventType.VIEWER_REQUEST,
				function: this.#redirectToIndexCloudfrontFunction,
			})
		}

		const edgeLambdas: EdgeLambda[] =
			this.props.cdk?.cloudfrontDistribution?.defaultBehavior?.edgeLambdas ?? []

		if (this.props.output === "edge" && this.props.lambdaFunction) {
			const functionVersion = new Version(this, "LambdaVersion", {
				lambda: this.props.lambdaFunction,
			})

			edgeLambdas.push({
				eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
				functionVersion,
				includeBody: true,
			})
		}

		this.#cloudfrontDistribution = new Distribution(this, "Distribution", {
			...this.props.cdk?.cloudfrontDistribution,
			additionalBehaviors: this.props.lambdaFunctionOrigin
				? {
						"/api/*": {
							allowedMethods: AllowedMethods.ALLOW_ALL,
							origin: this.props.lambdaFunctionOrigin,
							originRequestPolicy:
								OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
							responseHeadersPolicy:
								ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
							viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
							...this.props.cdk?.cloudfrontDistribution?.apiBehavior,
						},
						...this.props.cdk?.cloudfrontDistribution?.additionalBehaviors,
				  }
				: this.props.cdk?.cloudfrontDistribution?.additionalBehaviors,
			defaultBehavior: {
				origin: this.props.origin,
				originRequestPolicy: OriginRequestPolicy.USER_AGENT_REFERER_HEADERS,
				responseHeadersPolicy:
					ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				...this.props.cdk?.cloudfrontDistribution?.defaultBehavior,
				edgeLambdas,
				functionAssociations,
			},
			errorResponses: [
				{
					httpStatus: 404,
					responsePagePath: "/404",
				},
			],
		})
	}

	public get cdk() {
		return {
			cloudfrontDistribution: this.#cloudfrontDistribution,
			redirectToIndexCloudfrontFunction:
				this.#redirectToIndexCloudfrontFunction,
		}
	}
}
