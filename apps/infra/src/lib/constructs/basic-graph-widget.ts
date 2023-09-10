import type { GraphWidgetProps, Metric } from "aws-cdk-lib/aws-cloudwatch"
import { GraphWidget } from "aws-cdk-lib/aws-cloudwatch"

export type BasicGraphWidgetProps = Omit<
	GraphWidgetProps,
	"left" | "right" | "title"
> & {
	metric: Metric
}

export class BasicGraphWidget extends GraphWidget {
	public constructor(props: BasicGraphWidgetProps) {
		const { metric, ...graphWidgetProps } = props

		super({
			width: 12,
			...graphWidgetProps,
			left: [metric],
			title: metric.label,
		})
	}
}
