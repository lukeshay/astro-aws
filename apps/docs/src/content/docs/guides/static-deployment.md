---
title: Static Site Deployment
description: Learn how to deploy Astro sites as static sites without server-side rendering on AWS.
---

## Overview

Astro AWS supports deploying Astro sites as static sites without server-side rendering (SSR). Static deployment is the simplest and most cost-effective option for sites that don't require dynamic server-side functionality. When you deploy a static site, Astro AWS creates only the essential resources needed: an S3 bucket for hosting your static files and a CloudFront distribution for global content delivery.

## When to Use Static Deployment

Static deployment is ideal when:

- Your site doesn't require server-side rendering or API routes
- All content is pre-rendered at build time
- You want the lowest cost and simplest deployment option
- You don't need dynamic server-side functionality (environment variables, database access, etc.)
- Your site is primarily content-focused (blogs, documentation, marketing sites)

### Benefits of Static Deployment

- **Cost-effective**: No Lambda function costs, only S3 storage and CloudFront data transfer
- **Fast**: Pre-rendered pages are served directly from CloudFront edge locations
- **Simple**: Minimal infrastructure - just S3 and CloudFront
- **Scalable**: CloudFront automatically handles traffic spikes
- **Secure**: No server-side code means a smaller attack surface

## Configuring Astro for Static Output

To deploy a static site, configure your Astro project to use static output mode. This is the default mode for Astro projects.

### Basic Configuration

For a static site, you don't need the `@astro-aws/adapter` package. Simply configure your `astro.config.ts`:

```ts
// astro.config.ts
import { defineConfig } from "astro/config"

export default defineConfig({
	output: "static",
})
```

That's it! No adapter configuration is needed for static sites.

### Building Your Static Site

Build your Astro site as you normally would:

```bash
npm run build
```

This will generate static HTML, CSS, JavaScript, and other assets in the `dist` directory.

## Static vs SSR Comparison

Understanding the differences between static and SSR deployments helps you choose the right approach:

### Static Deployment

- **Output**: Pre-rendered HTML files
- **Build Time**: All pages are generated at build time
- **Runtime**: No server-side code execution
- **Infrastructure**: S3 bucket + CloudFront distribution
- **Cost**: Lower (no Lambda execution costs)
- **Performance**: Very fast (served from CloudFront edge cache)
- **Dynamic Content**: Not supported (must be client-side only)

### SSR Deployment

- **Output**: Server-rendered HTML on each request
- **Build Time**: Only static assets are built
- **Runtime**: Lambda function executes on each request
- **Infrastructure**: S3 bucket + CloudFront + Lambda function
- **Cost**: Higher (Lambda execution costs)
- **Performance**: Fast (with CloudFront caching)
- **Dynamic Content**: Fully supported (server-side data fetching, API routes, etc.)

### When to Choose Each

**Choose Static when:**

- Your content doesn't change frequently
- You don't need API routes or server-side logic
- You want the simplest and cheapest deployment
- All dynamic features can be handled client-side

**Choose SSR when:**

- You need API routes (`/api/*`)
- You need server-side data fetching
- You need access to environment variables or secrets
- You need server-side authentication or authorization
- You need to generate pages dynamically based on user requests

## Deployment Configuration

Deploying a static site with Astro AWS is straightforward. The construct automatically detects static output and creates only the necessary resources.

### Basic Static Deployment

```ts ins={13-15}
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
		})
	}
}
```

The construct automatically:

- Detects that your site is static (no `metadata.json` file)
- Creates an S3 bucket for static assets
- Creates a CloudFront distribution
- Skips Lambda function creation (since `isSSR` is false)

### Customizing Static Deployment

You can customize the S3 bucket and CloudFront distribution even for static sites:

```ts ins={5-6,14-35}
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	CachePolicy,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { Duration } from "aws-cdk-lib"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(1),
			maxTtl: Duration.days(365),
		})

		const securityHeadersPolicy = new ResponseHeadersPolicy(
			this,
			"SecurityHeadersPolicy",
			{
				securityHeadersBehavior: {
					contentSecurityPolicy: {
						contentSecurityPolicy:
							"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';",
						override: true,
					},
				},
			},
		)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					defaultBehavior: {
						cachePolicy,
						responseHeadersPolicy: securityHeadersPolicy,
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
			},
		})
	}
}
```

### Specifying Output Directory

If your static site is built to a different directory or you're deploying from a pre-built directory:

```ts ins={14-16}
new AstroAWS(this, "AstroAWS", {
	outDir: "../my-astro-project/dist",
})
```

## How Static Detection Works

Astro AWS determines if your site is static by checking for the presence of a `metadata.json` file in your build output directory:

- **Static site**: No `metadata.json` file exists → `isSSR` is `false` → No Lambda function created
- **SSR site**: `metadata.json` file exists → `isSSR` is `true` → Lambda function created

The `metadata.json` file is automatically created by the `@astro-aws/adapter` when you use `output: "server"`. For static sites (`output: "static"`), this file is not created, so no adapter is needed.

## Static Site Limitations

While static deployment is simple and cost-effective, it has some limitations:

- **No API Routes**: API routes (`src/pages/api/*`) are not supported in static mode
- **No Server-Side Rendering**: Pages cannot be rendered dynamically on the server
- **No Environment Variables**: Server-side environment variables are not available
- **No Server-Side Data Fetching**: All data fetching must happen at build time or client-side
- **Build-Time Only**: Dynamic content must be generated at build time

If you need any of these features, consider using SSR instead.

## Optimizing Static Sites

### Cache Configuration

For static sites, you can configure aggressive caching since content doesn't change frequently:

```ts ins={13-20}
const staticCachePolicy = new CachePolicy(this, "StaticCachePolicy", {
	defaultTtl: Duration.days(365),
	minTtl: Duration.days(1),
	maxTtl: Duration.days(365),
	cookieBehavior: CacheCookieBehavior.none(),
	queryStringBehavior: CacheQueryStringBehavior.none(),
	headerBehavior: CacheHeaderBehavior.none(),
})
```

### Incremental Static Regeneration

While Astro AWS doesn't support ISR out of the box for static sites, you can achieve similar results by:

1. Setting up a CI/CD pipeline to rebuild and redeploy on content changes
2. Using webhooks to trigger rebuilds when content is updated
3. Scheduling periodic rebuilds for sites with time-sensitive content

## Complete Example

Here's a complete example of deploying a static Astro site:

```ts ins={1,5-8,12,14-42}
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	CachePolicy,
	CacheCookieBehavior,
	CacheQueryStringBehavior,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		// Optimized cache policy for static content
		const staticCachePolicy = new CachePolicy(this, "StaticCachePolicy", {
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(1),
			maxTtl: Duration.days(365),
			cookieBehavior: CacheCookieBehavior.none(),
			queryStringBehavior: CacheQueryStringBehavior.none(),
		})

		// Security headers policy
		const securityHeadersPolicy = new ResponseHeadersPolicy(
			this,
			"SecurityHeadersPolicy",
			{
				securityHeadersBehavior: {
					contentSecurityPolicy: {
						contentSecurityPolicy:
							"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';",
						override: true,
					},
					strictTransportSecurity: {
						accessControlMaxAge: Duration.seconds(31536000),
						includeSubdomains: true,
						override: true,
					},
				},
			},
		)

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					defaultBehavior: {
						cachePolicy: staticCachePolicy,
						responseHeadersPolicy: securityHeadersPolicy,
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
			},
		})
	}
}
```

## Migrating from Static to SSR

If you start with a static site and later need SSR features, migration is straightforward:

1. Install the adapter: `npm install @astro-aws/adapter`
2. Update `astro.config.ts` to use `output: "server"`
3. Add the adapter configuration
4. Redeploy - the construct will automatically create the Lambda function

The existing S3 bucket and CloudFront distribution will be reused, and a Lambda function will be added.

## Next Steps

- Learn about [enabling SSR](/guides/enabling-ssr) if you need dynamic functionality
- Review [configuring deployment](/guides/configuring-deployment) for advanced customization options
- Check out the [API routes guide](/guides/api-routes) to understand when you might need SSR
