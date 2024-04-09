---
title: Advanced
description: Describes advanced usages of Astro AWS.
---

## Configuring Constructs

All constructs can be configured using the `cdk` object. The following example shows how to configure the `AstroAWS` construct.

```ts ins={11}
import { Stack } from "aws-cdk-lib/core"

export interface HelloCdkStackProps extends StackProps {}

export class HelloCdkStack extends Stack {
	public constructor(scope: Construct, id: string, props: HelloCdkStackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {},
		})
	}
}
```
