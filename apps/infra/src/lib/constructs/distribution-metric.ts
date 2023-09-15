import type { Distribution } from "aws-cdk-lib/aws-cloudfront"
import type { MetricProps } from "aws-cdk-lib/aws-cloudwatch"
import { Metric } from "aws-cdk-lib/aws-cloudwatch"

export type DistributionMetricProps = Omit<
	MetricProps,
	"dimensionsMap" | "namespace"
> & {
	distribution: Distribution
}

export class DistributionMetric extends Metric {
	public constructor(props: DistributionMetricProps) {
		const { distribution, ...metricProps } = props

		super({
			...metricProps,
			dimensionsMap: {
				DistributionId: distribution.distributionId,
				Region: "Global",
			},
			namespace: "AWS/CloudFront",
		})
	}
}
