import { type Construct } from "constructs"
import {
	type FunctionUrl,
	FunctionUrlAuthType,
	type FunctionUrlOptions,
	type Function,
} from "aws-cdk-lib/aws-lambda"
import { type IOrigin } from "aws-cdk-lib/aws-cloudfront"
import { type Bucket } from "aws-cdk-lib/aws-s3"
import {
	HttpOrigin,
	OriginGroup,
	S3Origin,
	type HttpOriginProps,
	type OriginGroupProps,
	type S3OriginProps,
} from "aws-cdk-lib/aws-cloudfront-origins"
import { Fn } from "aws-cdk-lib/core"

import { AstroAWSBaseConstruct } from "../types/astro-aws-construct.js"
import { type Output } from "../types/output.js"

export type AstroAWSOriginCdkProps = {
	lambdaFunctionOrigin?: HttpOriginProps
	lambdaFunctionUrl?: FunctionUrlOptions
	originGroup?: OriginGroupProps
	s3Origin?: S3OriginProps
}

export type AstroAWSOriginProps = {
	output: Output
	lambdaFunction?: Function
	s3Bucket: Bucket
	cdk?: AstroAWSOriginCdkProps
}

export type AstroAWSOriginCdk = {
	lambdaFunctionOrigin?: HttpOrigin
	lambdaFunctionUrl?: FunctionUrl
	origin: IOrigin
	originGroup?: OriginGroup
	s3Origin: S3Origin
}

export class AstroAWSOrigin extends AstroAWSBaseConstruct<
	AstroAWSOriginProps,
	AstroAWSOriginCdk
> {
	#origin: IOrigin
	#lambdaFunctionUrl?: FunctionUrl
	#s3Origin: S3Origin
	#lambdaFunctionOrigin?: HttpOrigin
	#originGroup?: OriginGroup

	public constructor(scope: Construct, id: string, props: AstroAWSOriginProps) {
		super(scope, id, props)

		this.#s3Origin = new S3Origin(this.props.s3Bucket, this.props.cdk?.s3Origin)

		if (this.props.lambdaFunction && this.props.output !== "static") {
			this.#lambdaFunctionUrl = this.props.lambdaFunction.addFunctionUrl({
				authType: FunctionUrlAuthType.NONE,
				...this.props.cdk?.lambdaFunctionUrl,
			})

			this.#lambdaFunctionOrigin = new HttpOrigin(
				Fn.parseDomainName(this.#lambdaFunctionUrl.url),
				this.props.cdk?.lambdaFunctionOrigin,
			)

			if (this.props.output === "server") {
				this.#originGroup = new OriginGroup({
					...this.props.cdk?.originGroup,
					fallbackOrigin: this.#s3Origin,
					fallbackStatusCodes: [
						404,
						...(this.props.cdk?.originGroup?.fallbackStatusCodes ?? []),
					],
					primaryOrigin: this.#lambdaFunctionOrigin,
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
