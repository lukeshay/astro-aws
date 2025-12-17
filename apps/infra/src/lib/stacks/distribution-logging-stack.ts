import { Stack } from "aws-cdk-lib/core"
import type { Construct } from "constructs"
import type { AstroAWSStackProps } from "../types/astro-aws-stack-props.js"
import {
	CfnDelivery,
	CfnDeliveryDestination,
	CfnDeliverySource,
	LogGroup,
} from "aws-cdk-lib/aws-logs"
import type { AstroAWS } from "@astro-aws/constructs"

type DistributionLoggingStackProps = AstroAWSStackProps & {
	mode: string
	runtime: string
	astroAWS: AstroAWS
}

class DistributionLoggingStack extends Stack {
	public constructor(
		scope: Construct,
		id: string,
		props: DistributionLoggingStackProps,
	) {
		super(scope, id, props)

		const { astroAWS, mode, environment, runtime } = props

		const distributionDeliverySource = new CfnDeliverySource(
			this,
			"DistributionDeliverySource",
			{
				name: `${environment}-${mode}-${runtime}-distribution-logs-src`,
				logType: "ACCESS_LOGS",
				resourceArn: Stack.of(this).formatArn({
					service: "cloudfront",
					region: "",
					resource: "distribution",
					resourceName: astroAWS.cdk.cloudfrontDistribution.distributionId,
				}),
			},
		)

		const distributionLogGroup = new LogGroup(this, "DistributionLogGroup")

		const distributionDeliveryDestination = new CfnDeliveryDestination(
			this,
			"DistributionDeliveryDestination",
			{
				name: `${environment}-${mode}-${runtime}-distribution-logs-dst`,
				destinationResourceArn: distributionLogGroup.logGroupArn,
				outputFormat: "json",
			},
		)

		new CfnDelivery(this, "DistributionDelivery", {
			deliverySourceName: distributionDeliverySource.name,
			deliveryDestinationArn: distributionDeliveryDestination.attrArn,
		}).node.addDependency(distributionDeliverySource)
	}
}

export { type DistributionLoggingStackProps, DistributionLoggingStack }
