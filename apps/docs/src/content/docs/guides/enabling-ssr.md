---
title: Enabling SSR
description: Describes how to enable a server side rendered application.
---

## Overview

Astro AWS adapter supports three modes for server-side rendering:

- **SSR**: Standard server-side rendering using AWS Lambda
- **SSR Streaming**: Server-side rendering with streaming support for improved performance
- **Edge**: Server-side rendering using AWS Lambda@Edge for lower latency

## Regular SSR

Regular SSR mode uses AWS Lambda to render your Astro pages on the server. This is the default mode and provides a good balance between performance and functionality.

### Configuration

Update your `astro.config.ts` file to enable SSR mode:

```ts ins={8}
// astro.config.ts
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "ssr",
	}),
})
```

### When to Use

- You need full access to AWS Lambda features (environment variables, longer execution times, etc.)
- Your application requires access to AWS services or resources
- You need more control over Lambda configuration
- Your pages don't require streaming capabilities

### Features

- ✅ Full AWS Lambda support
- ✅ Environment variables support
- ✅ Access to AWS SDK and services
- ✅ Configurable Lambda timeout and memory
- ✅ Standard SSR rendering

## SSR Streaming

SSR Streaming mode enables streaming responses, allowing your pages to start rendering content to users before the entire page is complete. This can significantly improve perceived performance, especially for pages with slow data fetching.

### Configuration

Update your `astro.config.ts` file to enable SSR streaming mode:

```ts ins={8}
// astro.config.ts
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "ssr-stream",
	}),
})
```

### When to Use

- You have pages with slow data fetching operations
- You want to improve Time to First Byte (TTFB) metrics
- Your pages can benefit from progressive rendering
- You want to provide a better user experience with faster perceived load times

### Features

- ✅ All features of regular SSR mode
- ✅ Streaming response support
- ✅ Progressive page rendering
- ✅ Improved perceived performance

### Example Usage

In your Astro pages, you can use streaming to render content progressively:

```astro
---
// pages/products.astro
const products = await fetchProducts() // Slow API call
---

<html>
	<head>
		<title>Products</title>
	</head>
	<body>
		<h1>Products</h1>
		<!-- Content streams as it becomes available -->
		{products.map(product => (
			<div>{product.name}</div>
		))}
	</body>
</html>
```

## Lambda@Edge (Edge Mode)

Edge mode uses AWS Lambda@Edge to run your Astro application at CloudFront edge locations, providing the lowest possible latency by executing code closer to your users.

> **IMPORTANT:** Environment variables are not supported in edge mode due to limitations of AWS Lambda@Edge.

### Configuration

Update your `astro.config.ts` file to enable edge mode:

```ts ins={8}
// astro.config.ts
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "edge",
	}),
})
```

### When to Use

- You need the lowest possible latency
- Your application doesn't require environment variables
- You want to reduce cold start times
- Your application logic is compatible with Lambda@Edge constraints

### Limitations

- ❌ Environment variables are not supported
- ⚠️ Limited execution time (5 seconds for viewer request/response, 30 seconds for origin request/response)
- ⚠️ Smaller deployment package size limits
- ⚠️ Limited access to AWS services (no VPC access)
- ⚠️ No access to the file system (except `/tmp`)

### Features

- ✅ Lowest latency (runs at edge locations)
- ✅ Reduced cold start times
- ✅ Automatic global distribution
- ✅ Standard SSR rendering

## Comparison

| Feature               | SSR          | SSR Streaming | Edge     |
| --------------------- | ------------ | ------------- | -------- |
| Latency               | Standard     | Standard      | Lowest   |
| Environment Variables | ✅           | ✅            | ❌       |
| Streaming             | ❌           | ✅            | ❌       |
| AWS Services Access   | ✅           | ✅            | Limited  |
| Execution Time        | Up to 15 min | Up to 15 min  | 5-30 sec |
| Cold Start            | Standard     | Standard      | Faster   |
| Deployment Size       | Standard     | Standard      | Limited  |

## Next Steps

- Learn about [advanced configuration options](/guides/configuring-deployment) for customizing your deployment
- Check out guides for [cookies](/guides/cookies) and [query parameters](/guides/query-parameters)
- Review the [@astro-aws/adapter reference](/reference/packages/adapter) for all adapter options
