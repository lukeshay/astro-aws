---
title: API Routes Configuration
description: Learn how to configure CloudFront behavior for Astro API routes.
---

## Overview

Astro AWS automatically routes all requests matching the `/api/*` pattern to your Lambda function (for SSR/Edge modes) or handles them server-side. This guide explains how API routes work and how to customize their CloudFront behavior configuration.

## Understanding API Routes in Astro

API routes in Astro are server-side endpoints that handle HTTP requests. They are created in the `src/pages/api` directory and export functions named after HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.).

When you deploy an Astro application with SSR enabled, API routes are handled by your Lambda function and routed through CloudFront with specific behavior settings optimized for API endpoints.

## Default API Behavior Configuration

By default, Astro AWS configures a CloudFront behavior pattern for `/api/*` paths with the following settings:

- **Path Pattern**: `/api/*` - Matches all requests to API routes
- **Allowed Methods**: `ALLOW_ALL` - Supports GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Origin**: Lambda function origin (for SSR/Edge modes)
- **Origin Request Policy**: `USER_AGENT_REFERER_HEADERS` - Forwards User-Agent and Referer headers
- **Response Headers Policy**: `CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS` - Enables CORS and security headers
- **Viewer Protocol Policy**: `REDIRECT_TO_HTTPS` - Redirects HTTP to HTTPS

These defaults ensure that:

- All HTTP methods are supported for API routes
- CORS headers are automatically included for cross-origin requests
- Requests are securely routed over HTTPS
- Headers needed for API functionality are forwarded to your Lambda function

## Customizing apiBehavior

You can customize the API behavior by providing an `apiBehavior` configuration object. This configuration merges with the default settings, so you only need to specify the properties you want to override.

### Basic Configuration

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				cloudfrontDistribution: {
					apiBehavior: {
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```

## Cache Policies for API Routes

API routes often return dynamic content that shouldn't be cached. You can configure a custom cache policy to control how CloudFront caches your API responses.

### No-Cache Policy for Dynamic APIs

For APIs that return dynamic or user-specific data, configure a cache policy that disables caching:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	CachePolicy,
	CacheCookieBehavior,
	CacheHeaderBehavior,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const apiCachePolicy = new CachePolicy(this, "ApiCachePolicy", {
			cookieBehavior: CacheCookieBehavior.all(),
			headerBehavior: CacheHeaderBehavior.allowList(
				"Authorization",
				"Content-Type",
			),
			queryStringBehavior: CacheQueryStringBehavior.all(),
			defaultTtl: Duration.seconds(0),
			minTtl: Duration.seconds(0),
			maxTtl: Duration.seconds(0),
		})

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				cloudfrontDistribution: {
					apiBehavior: {
						cachePolicy: apiCachePolicy,
					},
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```

### Cache Policy Options

When creating a cache policy for API routes, consider:

- **Cookie Behavior**: Use `CacheCookieBehavior.all()` to forward all cookies, or `CacheCookieBehavior.allowList()` to forward specific cookies
- **Header Behavior**: Use `CacheHeaderBehavior.allowList()` to forward specific headers like `Authorization` or `Content-Type`
- **Query String Behavior**: Use `CacheQueryStringBehavior.all()` to forward all query parameters, or `CacheQueryStringBehavior.allowList()` for specific parameters
- **TTL Settings**: Set `defaultTtl`, `minTtl`, and `maxTtl` to `Duration.seconds(0)` to disable caching, or configure appropriate cache durations

### Caching Static API Responses

If your API returns static or infrequently changing data, you can enable caching:

```ts
const apiCachePolicy = new CachePolicy(this, "ApiCachePolicy", {
	cookieBehavior: CacheCookieBehavior.none(),
	headerBehavior: CacheHeaderBehavior.none(),
	queryStringBehavior: CacheQueryStringBehavior.none(),
	defaultTtl: Duration.hours(1),
	minTtl: Duration.minutes(5),
	maxTtl: Duration.days(1),
})
```

## CORS Configuration

CORS (Cross-Origin Resource Sharing) headers are automatically configured for API routes using the `CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS` response headers policy. This policy:

- Allows requests from any origin (`Access-Control-Allow-Origin: *`)
- Supports preflight OPTIONS requests
- Includes security headers (Content-Security-Policy, Strict-Transport-Security, etc.)

### Custom CORS Configuration

If you need more restrictive CORS settings, you can create a custom response headers policy:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const corsPolicy = new ResponseHeadersPolicy(this, "CorsPolicy", {
			corsBehavior: {
				accessControlAllowCredentials: false,
				accessControlAllowHeaders: ["Content-Type", "Authorization"],
				accessControlAllowMethods: ["GET", "POST", "PUT", "DELETE"],
				accessControlAllowOrigins: ["https://example.com"],
				accessControlExposeHeaders: ["Content-Length"],
				accessControlMaxAge: Duration.seconds(3600),
				originOverride: true,
			},
		})

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				cloudfrontDistribution: {
					apiBehavior: {
						responseHeadersPolicy: corsPolicy,
					},
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```

## Different Behaviors for API vs Pages

The `apiBehavior` configuration only affects `/api/*` paths. All other paths (your Astro pages) use the `defaultBehavior` configuration. This allows you to have different caching, CORS, and other settings for API routes versus regular pages.

### Example: Different Cache Policies

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib/core"
import type { StackProps } from "aws-cdk-lib/core"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	CachePolicy,
	CacheCookieBehavior,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		// No-cache policy for API routes
		const apiCachePolicy = new CachePolicy(this, "ApiCachePolicy", {
			cookieBehavior: CacheCookieBehavior.all(),
			queryStringBehavior: CacheQueryStringBehavior.all(),
			defaultTtl: Duration.seconds(0),
			minTtl: Duration.seconds(0),
			maxTtl: Duration.seconds(0),
		})

		// Long cache policy for static pages
		const pageCachePolicy = new CachePolicy(this, "PageCachePolicy", {
			cookieBehavior: CacheCookieBehavior.none(),
			queryStringBehavior: CacheQueryStringBehavior.none(),
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(1),
			maxTtl: Duration.days(365),
		})

		new AstroAWS(this, "AstroAWS", {
			cdk: {
				cloudfrontDistribution: {
					apiBehavior: {
						cachePolicy: apiCachePolicy,
					},
					defaultBehavior: {
						cachePolicy: pageCachePolicy,
					},
				},
			},
			websiteDir: "../my-astro-project",
		})
	}
}
```

This configuration ensures that:

- API routes (`/api/*`) are never cached and always fetch fresh data
- Regular pages are cached for up to 365 days for optimal performance

## Configuration Merging

The `apiBehavior` configuration uses object spreading, which means your custom settings merge with the defaults. Properties you specify will override the defaults, while unspecified properties retain their default values.

For example, if you only specify a `cachePolicy`, the API behavior will still use:

- Default CORS headers
- Default origin request policy
- Default viewer protocol policy
- All other default settings

## Next Steps

- Learn about [configuring deployment](/guides/configuring-deployment) for other customization options
- Review the [@astro-aws/constructs reference](/reference/packages/constructs) for all available configuration options
