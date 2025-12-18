---
title: Performance Optimization
description: Optimize your Astro AWS deployment for better performance and cost efficiency.
---

## Overview

Optimizing your Astro AWS deployment can significantly improve performance, reduce latency, and lower costs. This guide covers key optimization strategies for CloudFront caching, Lambda configuration, architecture selection, and cost management.

## Cache Policy Tuning

CloudFront cache policies control how your content is cached at edge locations. Proper cache configuration can dramatically reduce origin requests and improve response times.

### Understanding TTL Settings

Cache policies use three TTL (Time To Live) settings:

- **`minTtl`**: Minimum time content stays in cache
- **`defaultTtl`**: Default cache duration when origin doesn't specify
- **`maxTtl`**: Maximum time content can be cached

### Static Content Cache Policy

For static sites or static assets, use aggressive caching:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
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

		const staticCachePolicy = new CachePolicy(this, "StaticCachePolicy", {
			defaultTtl: Duration.days(365),
			minTtl: Duration.days(1),
			maxTtl: Duration.days(365),
			cookieBehavior: CacheCookieBehavior.none(),
			queryStringBehavior: CacheQueryStringBehavior.none(),
		})

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					defaultBehavior: {
						cachePolicy: staticCachePolicy,
					},
				},
			},
		})
	}
}
```

### SSR Content Cache Policy

For SSR sites, configure caching to balance freshness with performance:

```ts
import {
	CachePolicy,
	CacheCookieBehavior,
	CacheQueryStringBehavior,
} from "aws-cdk-lib/aws-cloudfront"

const ssrCachePolicy = new CachePolicy(this, "SSRCachePolicy", {
	defaultTtl: Duration.hours(1),
	minTtl: Duration.seconds(0),
	maxTtl: Duration.days(7),
	cookieBehavior: CacheCookieBehavior.all(),
	queryStringBehavior: CacheQueryStringBehavior.all(),
})
```

**Key considerations:**

- Use shorter TTLs for dynamic content that changes frequently
- Set `minTtl` to 0 for content that must be immediately fresh
- Use `maxTtl` to prevent stale content from being cached too long
- Configure cookie and query string behavior based on your use case

## Price Class Selection

CloudFront price classes determine which edge locations serve your content. Choosing the right price class can significantly impact costs.

### Price Class Options

- **`PRICE_CLASS_100`**: Only North America and Europe (cheapest)
- **`PRICE_CLASS_200`**: Adds Asia, Middle East, and Africa
- **`PRICE_CLASS_ALL`**: All edge locations worldwide (most expensive)

### Choosing the Right Price Class

```ts
import { PriceClass } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const isProduction = process.env.ENVIRONMENT === "production"

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					priceClass: isProduction
						? PriceClass.PRICE_CLASS_ALL
						: PriceClass.PRICE_CLASS_100,
				},
			},
		})
	}
}
```

**Recommendations:**

- Use `PRICE_CLASS_100` for development/staging environments
- Use `PRICE_CLASS_100` if your audience is primarily in North America and Europe
- Use `PRICE_CLASS_ALL` for production sites with global audiences
- Monitor CloudFront metrics to determine if upgrading price class improves performance

## Lambda Memory & Timeout Optimization

Lambda function configuration directly impacts performance and cost. Optimizing memory allocation can improve execution speed and reduce costs.

### Memory Allocation

Lambda memory allocation affects CPU power proportionally. More memory = more CPU:

```ts
import { Architecture, Runtime, Tracing } from "aws-cdk-lib/aws-lambda"

new AstroAWS(this, "AstroAWS", {
	websiteDir: "../my-astro-project",
	cdk: {
		lambdaFunction: {
			memorySize: 512, // Start with 512MB
			timeout: Duration.seconds(10), // Set appropriate timeout
			architecture: Architecture.ARM_64,
			runtime: Runtime.NODEJS_24_X,
		},
	},
})
```

**Memory optimization tips:**

- Start with 512MB and monitor performance
- Increase memory if CPU utilization is high (>70%)
- Higher memory can reduce execution time, potentially lowering costs
- Use CloudWatch metrics to find the optimal memory size
- ARM64 architecture provides better price/performance (see below)

### Timeout Configuration

Set timeouts based on your application's needs:

```ts
cdk: {
	lambdaFunction: {
		timeout: Duration.seconds(10), // For fast SSR responses
		// timeout: Duration.seconds(30), // For complex pages with API calls
		// timeout: Duration.minutes(1), // For long-running operations
	},
},
```

**Timeout guidelines:**

- Static pages: 5-10 seconds
- Pages with API calls: 10-30 seconds
- Complex operations: Up to 15 minutes (Lambda maximum)
- Always set timeout higher than expected execution time

### Monitoring Lambda Performance

Enable X-Ray tracing to monitor Lambda performance:

```ts
cdk: {
	lambdaFunction: {
		tracing: Tracing.ACTIVE, // Enable X-Ray tracing
		memorySize: 1024,
		timeout: Duration.seconds(30),
	},
},
```

Use CloudWatch metrics to track:

- **Duration**: Average execution time
- **Errors**: Failed invocations
- **Throttles**: Concurrent execution limits
- **Memory utilization**: Actual memory used

## Architecture Selection (ARM vs x86)

AWS Lambda supports both ARM64 (Graviton2) and x86_64 architectures. ARM64 provides better price/performance for most workloads.

### ARM64 Benefits

- **20% better price/performance**: Lower cost per GB-second
- **Lower latency**: Better performance for CPU-bound tasks
- **Lower power consumption**: More efficient architecture

### Configuring ARM64

```ts
import { Architecture } from "aws-cdk-lib/aws-lambda"

new AstroAWS(this, "AstroAWS", {
	websiteDir: "../my-astro-project",
	cdk: {
		lambdaFunction: {
			architecture: Architecture.ARM_64, // Use ARM64 for better performance
			runtime: Runtime.NODEJS_24_X,
		},
	},
})
```

**When to use ARM64:**

- Default choice for new deployments
- Most Node.js applications work without modification
- Better for CPU-intensive operations

**When to use x86_64:**

- Dependencies that don't support ARM64
- Legacy applications with x86-specific code
- If you encounter compatibility issues

### Testing Architecture Performance

Compare architectures by deploying both and monitoring:

```ts
// Test configuration
cdk: {
	lambdaFunction: {
		architecture: Architecture.ARM_64, // or Architecture.X86_64
		memorySize: 1024,
		tracing: Tracing.ACTIVE,
	},
},
```

Monitor CloudWatch metrics to compare:

- Execution duration
- Cost per request
- Error rates

## CloudFront Optimization

Beyond caching, several CloudFront settings can improve performance.

### Compression

Enable compression to reduce transfer sizes:

```ts
import {
	CachePolicy,
	CompressionFormat,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"

const cachePolicy = new CachePolicy(this, "CachePolicy", {
	defaultTtl: Duration.days(1),
	minTtl: Duration.seconds(0),
	maxTtl: Duration.days(7),
	enableAcceptEncodingBrotli: true,
	enableAcceptEncodingGzip: true,
})

new AstroAWS(this, "AstroAWS", {
	websiteDir: "../my-astro-project",
	cdk: {
		cloudfrontDistribution: {
			defaultBehavior: {
				cachePolicy,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				compress: true, // Enable compression
			},
		},
	},
})
```

### HTTP/2 and HTTP/3

CloudFront automatically uses HTTP/2 and HTTP/3 when supported by clients. Ensure your origin supports these protocols.

### Origin Shield

For high-traffic sites, consider using Origin Shield to reduce origin load:

```ts
cdk: {
	cloudfrontDistribution: {
		enableOriginShield: true,
		originShieldRegion: "us-east-1", // Choose region closest to origin
	},
},
```

## Cost Optimization Tips

### 1. Use Static Deployment When Possible

Static sites have no Lambda execution costs:

```ts
// astro.config.ts
export default defineConfig({
	output: "static", // No Lambda costs
})
```

### 2. Optimize Cache Hit Rates

Higher cache hit rates reduce Lambda invocations:

- Use appropriate TTL values
- Cache static assets aggressively
- Use cache headers from your application

### 3. Right-Size Lambda Memory

Find the optimal memory size:

```ts
// Start low and increase based on metrics
memorySize: 512, // Test with 512MB
// Monitor and adjust based on:
// - Execution time
// - Memory utilization
// - Cost per request
```

### 4. Use ARM64 Architecture

ARM64 provides better price/performance:

```ts
architecture: Architecture.ARM_64, // 20% better price/performance
```

### 5. Choose Appropriate Price Class

Use `PRICE_CLASS_100` unless you need global coverage:

```ts
priceClass: PriceClass.PRICE_CLASS_100, // Cheaper for NA/EU audiences
```

### 6. Monitor and Optimize

Regular monitoring helps identify optimization opportunities:

- Review CloudWatch metrics weekly
- Analyze Lambda execution times
- Monitor cache hit rates
- Track costs per request

## Complete Optimization Example

Here's a complete example combining multiple optimization strategies:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Architecture, Runtime, Tracing } from "aws-cdk-lib/aws-lambda"
import {
	CachePolicy,
	CacheCookieBehavior,
	CacheQueryStringBehavior,
	PriceClass,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const isProduction = process.env.ENVIRONMENT === "production"

		// Optimized cache policy for SSR
		const cachePolicy = new CachePolicy(this, "CachePolicy", {
			defaultTtl: Duration.hours(1),
			minTtl: Duration.seconds(0),
			maxTtl: Duration.days(7),
			cookieBehavior: CacheCookieBehavior.all(),
			queryStringBehavior: CacheQueryStringBehavior.all(),
			enableAcceptEncodingBrotli: true,
			enableAcceptEncodingGzip: true,
		})

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					memorySize: 1024, // Optimized memory size
					timeout: Duration.seconds(10),
					architecture: Architecture.ARM_64, // Better price/performance
					runtime: Runtime.NODEJS_24_X,
					tracing: Tracing.ACTIVE, // Enable monitoring
				},
				cloudfrontDistribution: {
					priceClass: isProduction
						? PriceClass.PRICE_CLASS_ALL
						: PriceClass.PRICE_CLASS_100,
					defaultBehavior: {
						cachePolicy,
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
						compress: true,
					},
				},
			},
		})
	}
}
```

## Performance Monitoring

Monitor these key metrics to track optimization effectiveness:

### CloudFront Metrics

- **Cache hit rate**: Should be >80% for static content
- **Requests**: Track request volume
- **4xx/5xx error rates**: Monitor for issues
- **Data transfer**: Track bandwidth usage

### Lambda Metrics

- **Duration**: Average execution time (aim for <500ms)
- **Invocations**: Request count
- **Errors**: Error rate (should be <1%)
- **Throttles**: Concurrent execution limits
- **Memory utilization**: Actual memory used

### Cost Metrics

- **Lambda cost**: GB-seconds and requests
- **CloudFront cost**: Data transfer and requests
- **S3 cost**: Storage and requests

## Next Steps

- Review [configuring deployment](/guides/configuring-deployment) for more customization options
- Learn about [enabling SSR](/guides/enabling-ssr) if you need dynamic functionality
- Explore the [@astro-aws/constructs reference](/reference/packages/constructs) for all available options
