---
title: Query Parameters
description: Describes how to access query parameters on the server.
---

## Setup

Follow the [getting started guide](./getting-started) to create a new Astro project with the Astro AWS adapter.

## Allowing Query Parameters

In order to allow query parameters to be passed to your application, you must create a custom `CachePolicy` for the CloudFront distribution. The following example based on the getting started guide will allow all query parameters to be passed to your application.

```ts ins={16-18,21-31}
// lib/hello-cdk-stack.ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"
import {
	CachePolicy,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront"

export interface HelloCdkStackProps extends StackProps {}

export class HelloCdkStack extends Stack {
	public constructor(scope: Construct, id: string, props: HelloCdkStackProps) {
		super(scope, id, props)

		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			queryStringBehavior: CacheQueryStringBehavior.all(),
		})

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				// This configures all subpaths of /api.
				apiBehavior: {
					cachePolicy,
				},
				// This configures everything excluding subpaths of /api.
				cloudfrontDistribution: {
					cachePolicy,
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```

```

```
