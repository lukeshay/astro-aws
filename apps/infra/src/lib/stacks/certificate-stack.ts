import { Stack } from "aws-cdk-lib/core"
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager"
import type { Construct } from "constructs"
import { HostedZone, type IHostedZone } from "aws-cdk-lib/aws-route53"

import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"

export type CertificateStackProps = AstroAWSStackProps & {
	aliases: readonly [string, ...string[]]
	hostedZoneName: string
}

export class CertificateStack extends Stack {
	public readonly certificate: Certificate
	public readonly hostedZone: IHostedZone

	public constructor(
		scope: Construct,
		id: string,
		props: CertificateStackProps,
	) {
		super(scope, id, {
			...props,
			env: {
				...props.env,
				region: "us-east-1",
			},
		})

		const { hostedZoneName, aliases } = props
		const [domainName, ...restDomainNames] = aliases.map((alias) =>
			[alias, hostedZoneName].filter(Boolean).join("."),
		) as [string, ...string[]]

		this.hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: hostedZoneName,
		})

		this.certificate = new Certificate(this, "Certificate", {
			domainName,
			subjectAlternativeNames: restDomainNames,
			validation: CertificateValidation.fromDns(this.hostedZone),
		})
	}
}
