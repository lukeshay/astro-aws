import type { StackProps } from "aws-cdk-lib/core"

import type { Environment } from "../constants/environments.js"

export type AstroAWSStackProps = Readonly<
	Omit<StackProps, "env"> & {
		alias?: string
		distDir?: string
		env: {
			account: string
			region: string
		}
		environment: Environment
		hostedZoneName?: string
		package: string
		skipDashboard?: boolean
	}
>
