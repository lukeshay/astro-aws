---
title: Configuring Deployment
description: Learn how to configure AWS CDK constructs to customize your Astro AWS deployment.
---

## Overview

The `AstroAWS` construct creates all the necessary AWS resources for your Astro application:

- **S3 bucket** to host static website assets
- **Lambda function** to handle server-side rendering (if SSR is enabled)
- **CloudFront distribution** to serve your website globally
- **Origin access identity** to secure access to the S3 bucket

All resources can be customized through the `cdk` prop, which allows you to configure:

- Lambda function settings (memory, timeout, environment variables, etc.)
- CloudFront distribution settings (cache policies, custom domains, SSL certificates, etc.)
- S3 bucket settings (logging, encryption, etc.)

## Basic Configuration

Here's a minimal example of using the `AstroAWS` construct. This will automatically identify which type of deployment you are wanting (SSR, SSR stream, Lambda@Edge):

```ts ins={13-15}
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"

export interface AstroSiteStackProps extends StackProps {}

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: AstroSiteStackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project", // Path to your Astro project directory
		})
	}
}
```

## Customizing Resources

You can customize any AWS resource by passing configuration options through the `cdk` prop. The construct exposes all customizable properties from the underlying AWS CDK resources.

### Lambda Function Configuration

Configure your Lambda function for SSR:

```ts ins={2,6,14-26}
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Architecture, Runtime, Tracing } from "aws-cdk-lib/aws-lambda"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					memorySize: 1024, // Increase memory allocation
					timeout: Duration.seconds(30), // Set timeout
					architecture: Architecture.ARM_64, // Use ARM architecture
					runtime: Runtime.NODEJS_24_X, // Specify Node.js version
					environment: {
						API_URL: "https://api.example.com",
						NODE_ENV: "production",
					},
					tracing: Tracing.ACTIVE, // Enable X-Ray tracing
				},
			},
		})
	}
}
```

### CloudFront Distribution Configuration

Customize your CloudFront distribution:

```ts ins={5,13-23}
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ViewerProtocolPolicy, PriceClass } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					comment: "My Astro Application",
					priceClass: PriceClass.PRICE_CLASS_100, // Use only North America and Europe
					defaultBehavior: {
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
					domainNames: ["example.com", "www.example.com"], // Custom domains
					// certificate: myCertificate, // SSL certificate (required for custom domains)
				},
			},
		})
	}
}
```

### S3 Bucket Configuration

Configure your S3 bucket:

```ts ins={5,11,15-22}
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Bucket } from "aws-cdk-lib/aws-s3"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const logBucket = new Bucket(this, "AccessLogBucket")

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				s3Bucket: {
					serverAccessLogsBucket: logBucket,
					serverAccessLogsPrefix: "s3-access-logs/",
					// encryption: BucketEncryption.S3_MANAGED,
					// versioned: true,
				},
			},
		})
	}
}
```

### Complete Example

Here's a comprehensive example combining multiple configurations:

```ts ins={1,5-7,11,13-35,38-41}
import { Stack, CfnOutput, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Architecture, Runtime, Tracing } from "aws-cdk-lib/aws-lambda"
import { ViewerProtocolPolicy, PriceClass } from "aws-cdk-lib/aws-cloudfront"
import { Bucket } from "aws-cdk-lib/aws-s3"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const logBucket = new Bucket(this, "AccessLogBucket")

		const astroAWS = new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					memorySize: 1024,
					timeout: Duration.seconds(30),
					architecture: Architecture.ARM_64,
					runtime: Runtime.NODEJS_24_X,
					environment: {
						API_URL: "https://api.example.com",
					},
					tracing: Tracing.ACTIVE,
				},
				cloudfrontDistribution: {
					comment: "Production Astro Application",
					priceClass: PriceClass.PRICE_CLASS_ALL,
					defaultBehavior: {
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
				s3Bucket: {
					serverAccessLogsBucket: logBucket,
					serverAccessLogsPrefix: "s3-access-logs/",
				},
			},
		})

		// Output the CloudFront distribution URL
		new CfnOutput(this, "DistributionDomainName", {
			value: astroAWS.cdk.cloudfrontDistribution.distributionDomainName,
		})
	}
}
```

## Accessing Constructed Resources

You can access the underlying AWS resources through the `cdk` property:

```ts ins={4-11}
const astroAWS = new AstroAWS(this, "AstroAWS", {
	websiteDir: "../my-astro-project",
})

// Access CloudFront distribution
const distribution = astroAWS.cdk.cloudfrontDistribution

// Access Lambda function (if SSR is enabled)
const lambdaFunction = astroAWS.cdk.lambdaFunction

// Access S3 bucket
const s3Bucket = astroAWS.cdk.s3Bucket
```

## Next Steps

- Learn about [enabling SSR](/guides/enabling-ssr) in your Astro application
- Review the [@astro-aws/constructs reference](/reference/packages/constructs) for all available configuration options
- Check out the [example infrastructure code](https://github.com/lukeshay/astro-aws/blob/main/apps/infra/src/lib/stacks/website-stack.ts) for more advanced configurations
