import type { StackProps } from "aws-cdk-lib/core"

import type { Environment } from "../constants/environments.js"

export type AstroAWSStackProps = Readonly<
	Omit<StackProps, "env"> & {
		env: {
			account: string | undefined
			region: string
		}
		environment: Environment
	}
>
