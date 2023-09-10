import type { StackProps } from "aws-cdk-lib/core"

import type { Environment } from "../constants/environments.js"

export type AstroAWSStackProps = Readonly<
	Omit<StackProps, "env"> & {
		env: {
			account: string
			region: string
		}
		environment: Environment
		alias?: string
		hostedZoneName?: string
		output: "edge" | "server" | "static"
		skipDashboard?: boolean
	}
>
