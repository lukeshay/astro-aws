---
title: Cookies
description: Describes how to access cookies on the server.
---

## Setup

Follow the [getting started guide](/start-here/getting-started) to create a new Astro project with the Astro AWS adapter.

## Allowing Cookies

In order to allow cookies to be passed to your application, you must create a custom `CachePolicy` for the CloudFront distribution. The following example based on the getting started guide will allow all cookies to be passed to your application.

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { AstroAWS } from "@astro-aws/constructs"
import { CachePolicy, CacheCookieBehavior } from "aws-cdk-lib/aws-cloudfront"

export interface AstroSiteStackProps extends StackProps {}

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: AstroSiteStackProps) {
		super(scope, id, props)

		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			cookieBehavior: CacheCookieBehavior.all(),
		})

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				// This configures all subpaths of /api.
				apiBehavior: {
					cachePolicy,
				},
				// This configures everything excluding subpaths of /api.
				cloudfrontDistribution: {
					defaultBehavior: {
						cachePolicy,
					},
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```
