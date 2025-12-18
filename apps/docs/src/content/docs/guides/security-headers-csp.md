---
title: Security Headers & Content Security Policy
description: Configure security headers and CSP policies for production deployments to protect your Astro AWS application.
---

## Overview

Security headers and Content Security Policy (CSP) are essential for protecting your web application from common attacks like cross-site scripting (XSS), clickjacking, and man-in-the-middle attacks. CloudFront allows you to configure these headers at the edge, ensuring they're applied to all responses before they reach your users.

## Why Security Headers Matter

Security headers provide an additional layer of protection for your application:

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling which resources can be loaded
- **Strict-Transport-Security (HSTS)**: Forces browsers to use HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls how much referrer information is sent with requests

## Creating ResponseHeadersPolicy

CloudFront uses `ResponseHeadersPolicy` to add security headers to responses. You can create a custom policy and apply it to your CloudFront distribution's default behavior.

### Basic Example

Here's a basic example of creating a `ResponseHeadersPolicy` with CSP:

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

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
						responseHeadersPolicy: securityHeadersPolicy,
					},
				},
			},
		})
	}
}
```

## Content Security Policy Configuration

Content Security Policy (CSP) is one of the most important security headers. It controls which resources can be loaded and executed on your pages.

### CSP Directive Overview

Common CSP directives include:

- `default-src`: Fallback for other fetch directives
- `script-src`: Controls which scripts can be executed
- `style-src`: Controls which stylesheets can be applied
- `img-src`: Controls which images can be loaded
- `connect-src`: Controls which URLs can be loaded via fetch, XMLHttpRequest, WebSocket, etc.
- `font-src`: Controls which fonts can be loaded
- `frame-src`: Controls which URLs can be embedded as frames
- `upgrade-insecure-requests`: Upgrades HTTP requests to HTTPS

### Strict CSP Policy

For maximum security, use a strict CSP policy that only allows resources from your own domain:

```ts
const strictSecurityPolicy = new ResponseHeadersPolicy(
	this,
	"StrictSecurityPolicy",
	{
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
				override: true,
			},
		},
	},
)
```

### CSP with External Resources

If your application needs to load resources from external domains (CDNs, APIs, etc.), you can include them in your CSP:

```ts
const cspWithExternalResources = new ResponseHeadersPolicy(
	this,
	"CSPWithExternalResources",
	{
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; img-src 'self' data: https:; upgrade-insecure-requests;",
				override: true,
			},
		},
	},
)
```

### CSP with AWS Services

If you're using AWS services like CloudWatch RUM or Cognito, you'll need to include their domains:

```ts
const cspWithAWSServices = new ResponseHeadersPolicy(
	this,
	"CSPWithAWSServices",
	{
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' cognito-identity.us-east-1.amazonaws.com dataplane.rum.us-east-1.amazonaws.com; upgrade-insecure-requests;",
				override: true,
			},
		},
	},
)
```

> **Note**: The example above includes `'unsafe-inline'` for styles and scripts, which is common for Astro applications but reduces security. Consider using nonces or hashes for better security in production.

## Common Security Headers

In addition to CSP, CloudFront's `ResponseHeadersPolicy` supports other security headers through the `securityHeadersBehavior` property.

### Complete Security Headers Example

Here's an example that includes multiple security headers:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const comprehensiveSecurityPolicy = new ResponseHeadersPolicy(
			this,
			"ComprehensiveSecurityPolicy",
			{
				securityHeadersBehavior: {
					contentSecurityPolicy: {
						contentSecurityPolicy:
							"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; upgrade-insecure-requests;",
						override: true,
					},
					strictTransportSecurity: {
						accessControlMaxAge: Duration.seconds(31536000), // 1 year
						includeSubdomains: true,
						override: true,
					},
					contentTypeOptions: {
						override: true,
					},
					frameOptions: {
						frameOption: "DENY",
						override: true,
					},
					referrerPolicy: {
						referrerPolicy: "strict-origin-when-cross-origin",
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
						responseHeadersPolicy: comprehensiveSecurityPolicy,
					},
				},
			},
		})
	}
}
```

### Available Security Headers

- **`strictTransportSecurity`**: Configures HSTS (HTTP Strict Transport Security)
  - `accessControlMaxAge`: How long browsers should remember to use HTTPS
  - `includeSubdomains`: Whether to apply to subdomains
- **`contentTypeOptions`**: Prevents MIME type sniffing
- **`frameOptions`**: Prevents clickjacking (`DENY` or `SAMEORIGIN`)
- **`referrerPolicy`**: Controls referrer information (`no-referrer`, `strict-origin-when-cross-origin`, etc.)

## CSP Examples for Different Use Cases

### Development/Testing (Permissive)

For development environments, you might want a more permissive CSP:

```ts
const devSecurityPolicy = new ResponseHeadersPolicy(this, "DevSecurityPolicy", {
	securityHeadersBehavior: {
		contentSecurityPolicy: {
			contentSecurityPolicy:
				"default-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' *; img-src 'self' data: *;",
			override: true,
		},
	},
})
```

### Production (Strict)

For production, use a strict policy:

```ts
const prodSecurityPolicy = new ResponseHeadersPolicy(
	this,
	"ProdSecurityPolicy",
	{
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
				override: true,
			},
		},
	},
)
```

### With Third-Party Analytics

If you're using analytics services like Google Analytics or Plausible:

```ts
const analyticsSecurityPolicy = new ResponseHeadersPolicy(
	this,
	"AnalyticsSecurityPolicy",
	{
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; script-src 'self' https://www.googletagmanager.com https://plausible.io; connect-src 'self' https://www.google-analytics.com https://plausible.io; img-src 'self' data: https:;",
				override: true,
			},
		},
	},
)
```

## Applying to Different Behaviors

You can apply different security policies to different CloudFront behaviors. For example, you might want stricter policies for your main site and different policies for API routes:

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { ResponseHeadersPolicy } from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const defaultSecurityPolicy = new ResponseHeadersPolicy(
			this,
			"DefaultSecurityPolicy",
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

		const apiSecurityPolicy = new ResponseHeadersPolicy(
			this,
			"ApiSecurityPolicy",
			{
				securityHeadersBehavior: {
					contentSecurityPolicy: {
						contentSecurityPolicy: "default-src 'self';",
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
						responseHeadersPolicy: defaultSecurityPolicy,
					},
					apiBehavior: {
						responseHeadersPolicy: apiSecurityPolicy,
					},
				},
			},
		})
	}
}
```

## Testing Security Headers

After deploying your stack, you can verify that security headers are being applied correctly.

### Using Browser DevTools

1. Open your website in a browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Reload the page
5. Click on any request
6. Check the Response Headers section

You should see headers like:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`

### Using curl

You can test headers using curl:

```bash
curl -I https://your-domain.com
```

Look for security headers in the response.

### Using Online Tools

Several online tools can help you test your security headers:

- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

These tools will scan your site and provide a security score along with recommendations.

## Best Practices

1. **Start Strict**: Begin with a strict CSP and relax it only when necessary
2. **Use Nonces or Hashes**: Instead of `'unsafe-inline'`, use nonces or hashes for inline scripts and styles
3. **Test Thoroughly**: Test your CSP in development before deploying to production
4. **Monitor Violations**: Use CSP reporting to catch violations (`report-uri` or `report-to`)
5. **Keep Updated**: Review and update your security headers regularly
6. **Environment-Specific**: Use different policies for development, staging, and production

## Complete Example

Here's a complete example combining all the concepts:

```ts
// lib/astro-site-stack.ts
import { Stack, Duration } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const securityHeadersPolicy = new ResponseHeadersPolicy(
			this,
			"SecurityHeadersPolicy",
			{
				securityHeadersBehavior: {
					contentSecurityPolicy: {
						contentSecurityPolicy:
							"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' cognito-identity.us-east-1.amazonaws.com dataplane.rum.us-east-1.amazonaws.com; upgrade-insecure-requests;",
						override: true,
					},
					strictTransportSecurity: {
						accessControlMaxAge: Duration.seconds(31536000),
						includeSubdomains: true,
						override: true,
					},
					contentTypeOptions: {
						override: true,
					},
					frameOptions: {
						frameOption: "DENY",
						override: true,
					},
					referrerPolicy: {
						referrerPolicy: "strict-origin-when-cross-origin",
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
						responseHeadersPolicy: securityHeadersPolicy,
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
			},
		})
	}
}
```

## Next Steps

- Learn about [custom domains and SSL certificates](/guides/custom-domains-ssl) for your deployment
- Review the [AWS CloudFront ResponseHeadersPolicy documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront.ResponseHeadersPolicy.html)
- Check out the [example infrastructure code](https://github.com/lukeshay/astro-aws/blob/main/apps/infra/src/lib/stacks/website-stack.ts) for a real-world implementation
