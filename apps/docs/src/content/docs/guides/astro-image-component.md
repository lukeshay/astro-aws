---
title: Astro Image Component
description: Add a Sharp Lambda layer to AstroAWS so the Astro Image component works in SSR mode.
---

## Overview

When you use Astro's Image component in SSR mode, Sharp must be available in the Lambda runtime. The easiest way to provide it is with a Lambda layer and attach that layer to the function created by `AstroAWS`.

> **Important:** This approach does not work with `mode: "edge"` (Lambda@Edge).

This guide shows how to:

- Build a Sharp layer for Lambda
- Attach the layer with `cdk.lambdaFunction.layers`
- Verify Astro Image works after deployment

## 1) Create a Sharp layer

Lambda expects Node.js dependencies in a `nodejs` folder inside the layer bundle.

```text
layers/
  sharp/
    nodejs/
      package.json
      node_modules/
```

Create `layers/sharp/nodejs/package.json`:

```json
{
	"dependencies": {
		"sharp": "^0.34.0"
	},
	"name": "sharp-layer",
	"private": true
}
```

Install dependencies from `layers/sharp/nodejs` using a Linux-compatible environment so the Sharp binary matches Lambda.

Example with Docker:

```sh
docker run --rm -v "$PWD":/work -w /work/layers/sharp/nodejs public.ecr.aws/docker/library/node:20-bookworm sh -c "npm install --omit=dev"
```

If your function uses ARM64, build the layer for ARM64. If it uses x86_64, build for x86_64.

## 2) Attach the layer to AstroAWS

In your CDK stack, create a `LayerVersion` and pass it to `cdk.lambdaFunction.layers`.

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Code, LayerVersion, Runtime } from "aws-cdk-lib/aws-lambda"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const sharpLayer = new LayerVersion(this, "SharpLayer", {
			code: Code.fromAsset("layers/sharp"),
			compatibleRuntimes: [Runtime.NODEJS_24_X],
			description: "Sharp dependency for Astro Image",
		})

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					layers: [sharpLayer],
				},
			},
		})
	}
}
```

## 3) Deploy and verify

Deploy your stack, then request a page that renders an Astro `Image` component.

If Sharp is configured correctly, the page should render without runtime image errors in Lambda logs.

## Troubleshooting

- **`Could not load sharp`**: Rebuild the layer in a Linux environment matching your Lambda architecture.
- **Architecture mismatch**: Make sure your layer build target matches `cdk.lambdaFunction.architecture`.
- **Node runtime mismatch**: Keep `compatibleRuntimes` aligned with your Lambda runtime.

## Next Steps

- Review [configuring deployment](/guides/configuring-deployment) for additional Lambda settings.
- See [performance optimization](/guides/performance-optimization) for memory and architecture tuning.
