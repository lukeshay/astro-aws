# @astro-aws/constructs

Constructs for deploying your [Astro](https://astro.build/) project that is built using [@astro-aws/adapter](https://www.npmjs.com/package/@astro-aws/adapter).

## SSR Usage

1. Install this package and it's peer dependencies in your AWS CDK project.

```sh
# Using NPM
npm install @astro-aws/constructs constructs aws-cdk-lib

# Using Yarn
yarn add @astro-aws/constructs constructs aws-cdk-lib

# Using PNPM
pnpm add @astro-aws/constructs constructs aws-cdk-lib
```

2. Add the construct to your CDK stack.

```ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			output: "server",
			websitePath: "..", // Replace with the path to your website code.
		})
	}
}
```

## SSR Edge Usage

1. Install this package and it's peer dependencies in your AWS CDK project.

```sh
# Using NPM
npm install @astro-aws/constructs constructs aws-cdk-lib

# Using Yarn
yarn add @astro-aws/constructs constructs aws-cdk-lib

# Using PNPM
pnpm add @astro-aws/constructs constructs aws-cdk-lib
```

2. Add the construct to your CDK stack.

```ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			output: "edge",
			websitePath: "..", // Replace with the path to your website code.
		})
	}
}
```

## Static Usage

1. Install this package and it's peer dependencies in your AWS CDK project.

```sh
# Using NPM
npm install @astro-aws/constructs constructs aws-cdk-lib

# Using Yarn
yarn add @astro-aws/constructs constructs aws-cdk-lib

# Using PNPM
pnpm add @astro-aws/constructs constructs aws-cdk-lib
```

2. Add the construct to your CDK stack.

```ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			output: "static",
			websitePath: "..", // Replace with the path to your website code.
		})
	}
}
```

## Customization

All the resources created by the `AstroAWS` construct can be customized. We expose every prop of the resources that is customizable. The props can be set by passing them in to the `cdk` field on the `AstroAWS` construct props. Depending on the deployment method, not all of the props will be used. The constructed can be access through the `cdk` field on the `AstroAWS` construct object.

```ts
import { Stack, CfnOutput } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props)

		const astroAWS = new AstroAWS(this, "AstroAWS", {
			cdk: {
				lambdaFunction: {
					memorySize: 1024,
				},
			},
			output: "server",
			websitePath: "..", // Replace with the path to your website code.
		})

		new CfnOutput(this, "DistributionDomainName", {
			value: astroAWS.cdk.cloudfrontDistribution.distributionDomainName,
		})
	}
}
```

## Example

See [the source code of this site](https://github.com/lukeshay/astro-aws/blob/main/apps/infra/src/lib/stacks/website-stack.ts)
