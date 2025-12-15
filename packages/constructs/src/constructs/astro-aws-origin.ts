import { type Construct } from "constructs"
import {
	type FunctionUrl,
	FunctionUrlAuthType,
	InvokeMode,
	type FunctionUrlOptions,
	type Function,
} from "aws-cdk-lib/aws-lambda"
import { type IOrigin, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront"
import { type Bucket } from "aws-cdk-lib/aws-s3"
import {
	HttpOrigin,
	OriginGroup,
	S3BucketOrigin,
	type HttpOriginProps,
	type OriginGroupProps,
	type S3BucketOriginWithOAIProps,
} from "aws-cdk-lib/aws-cloudfront-origins"
import { Fn } from "aws-cdk-lib/core"

import {
	AstroAWSBaseConstruct,
	type AstroAWSBaseConstructProps,
} from "../types/astro-aws-construct.js"

type AstroAWSOriginCdkProps = {
	lambdaFunctionOrigin?: HttpOriginProps
	lambdaFunctionUrl?: FunctionUrlOptions
	originGroup?: OriginGroupProps
	s3Origin?: S3BucketOriginWithOAIProps
}

type AstroAWSOriginProps = AstroAWSBaseConstructProps & {
	lambdaFunction?: Function
	s3Bucket: Bucket
	originAccessIdentity?: OriginAccessIdentity
	cdk?: AstroAWSOriginCdkProps
}

type AstroAWSOriginCdk = {
	lambdaFunctionOrigin?: HttpOrigin
	lambdaFunctionUrl?: FunctionUrl
	origin: IOrigin
	originGroup?: OriginGroup
	s3Origin: IOrigin
}

class AstroAWSOrigin extends AstroAWSBaseConstruct<
	AstroAWSOriginProps,
	AstroAWSOriginCdk
> {
	#origin: IOrigin
	#lambdaFunctionUrl?: FunctionUrl
	#s3Origin: IOrigin
	#lambdaFunctionOrigin?: HttpOrigin
	#originGroup?: OriginGroup

	public constructor(scope: Construct, id: string, props: AstroAWSOriginProps) {
		super(scope, id, props)

		this.#s3Origin = S3BucketOrigin.withOriginAccessIdentity(
			this.props.s3Bucket,
			{
				...this.props.cdk?.s3Origin,
				originAccessIdentity: this.props.originAccessIdentity,
			},
		)

		if (this.props.lambdaFunction && this.isSSR) {
			this.#lambdaFunctionUrl = this.props.lambdaFunction.addFunctionUrl({
				authType: FunctionUrlAuthType.NONE,
				invokeMode:
					this.metadata?.args.mode === "ssr-stream"
						? InvokeMode.RESPONSE_STREAM
						: InvokeMode.BUFFERED,
				...this.props.cdk?.lambdaFunctionUrl,
			})

			this.#lambdaFunctionOrigin = new HttpOrigin(
				Fn.parseDomainName(this.#lambdaFunctionUrl.url),
				this.props.cdk?.lambdaFunctionOrigin,
			)

			if (this.metadata?.args.mode.includes("ssr")) {
				this.#originGroup = new OriginGroup({
					...this.props.cdk?.originGroup,
					fallbackOrigin: this.#lambdaFunctionOrigin,
					fallbackStatusCodes: [
						400,
						403,
						404,
						416,
						500,
						502,
						503,
						504,
						...(this.props.cdk?.originGroup?.fallbackStatusCodes ?? []),
					],
					primaryOrigin: this.#s3Origin,
				})

				this.#origin = this.#originGroup
			} else {
				this.#origin = this.#s3Origin
			}
		} else {
			this.#origin = this.#s3Origin
		}
	}

	public get cdk() {
		return {
			lambdaFunctionOrigin: this.#lambdaFunctionOrigin,
			lambdaFunctionUrl: this.#lambdaFunctionUrl,
			origin: this.#origin,
			originGroup: this.#originGroup,
			s3Origin: this.#s3Origin,
		}
	}
}

export {
	type AstroAWSOriginCdkProps,
	type AstroAWSOriginProps,
	type AstroAWSOriginCdk,
	AstroAWSOrigin,
}
