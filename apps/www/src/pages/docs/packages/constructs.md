---
layout: ../../../layouts/DocsLayout.astro
section: Packages
title: "@astro-aws/constructs"
---

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
import { Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import { AstroAWSConstruct } from "@astro-aws/constructs";

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props);

		new AstroAWSConstruct(this, "AstroAWSConstruct", {
			output: "server",
			websitePath: "..", // Replace with the path to your website code.
		});
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
import { Stack } from "aws-cdk-lib";
import type { StackProps } from "aws-cdk-lib";
import { AstroAWSConstruct } from "@astro-aws/constructs";

export interface MyAstroStackProps extends StackProps {}

export class MyAstroStack extends Stack {
	public constructor(scope: Construct, id: string, props: MyAstroStackProps) {
		super(scope, id, props);

		new AstroAWSConstruct(this, "AstroAWSConstruct", {
			output: "static",
			websitePath: "..", // Replace with the path to your website code.
		});
	}
}
```

## Example

See [the source code of this site](https://github.com/lukeshay/astro-aws/blob/main/apps/infra/src/stacks/website-stack.ts)
