import type { StackProps } from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Dashboard } from "aws-cdk-lib/aws-cloudwatch";
import type { Construct } from "constructs";

export type MonitoringStackProps = StackProps & {
	readonly environment: string;
};

export class MonitoringStack extends Stack {
	public readonly cloudwatchDashboard: Dashboard;

	public constructor(scope: Construct, id: string, props: MonitoringStackProps) {
		super(scope, id, props);

		const { environment } = props;

		this.cloudwatchDashboard = new Dashboard(this, `AstroAWSDashboard-${environment}`, {
			dashboardName: `AstroAWS-${environment}`,
		});
	}
}
