---
title: Environment Variables & Secrets
description: Learn how to configure environment variables and secrets for your Astro AWS Lambda functions.
---

## Overview

Environment variables allow you to configure your Astro application with different values for different environments (development, staging, production) without changing your code. When using Astro AWS with SSR enabled, you can configure environment variables that are available to your Lambda function and accessible in your Astro pages, API routes, and middleware.

## Basic Environment Variables

The simplest way to configure environment variables is through the `lambdaFunction.environment` property in your CDK stack configuration.

### Basic Configuration

```ts
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
			cdk: {
				lambdaFunction: {
					environment: {
						API_URL: "https://api.example.com",
						NODE_ENV: "production",
						APP_VERSION: "1.0.0",
					},
				},
			},
		})
	}
}
```

### Accessing Environment Variables in Astro

Once configured, you can access these environment variables in your Astro code using `import.meta.env`. Environment variables are available in:

- **Pages** (`.astro` files)
- **API Routes** (`src/pages/api/*`)
- **Middleware** (`src/middleware.ts`)
- **Server Components**

```astro
---
// src/pages/index.astro
const apiUrl = import.meta.env.API_URL
const nodeEnv = import.meta.env.NODE_ENV

// Use the environment variables
const response = await fetch(`${apiUrl}/data`)
const data = await response.json()
---

<html>
	<head>
		<title>My App</title>
	</head>
	<body>
		<h1>Environment: {nodeEnv}</h1>
		<!-- Use your data here -->
	</body>
</html>
```

### Type-Safe Environment Variables

For better TypeScript support, you can declare your environment variables in `src/env.d.ts`:

```ts
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly API_URL: string
	readonly NODE_ENV: string
	readonly APP_VERSION: string
	readonly DOMAIN?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
```

This provides autocomplete and type checking when accessing environment variables:

```astro
---
// TypeScript will now validate these environment variables
const apiUrl = import.meta.env.API_URL // ✅ Type-safe
const invalid = import.meta.env.INVALID_VAR // ❌ TypeScript error
---
```

## Environment-Specific Configuration

You can configure different environment variables for different deployment environments (development, staging, production) by conditionally setting values based on your stack context.

### Using Stack Context

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"

interface AstroSiteStackProps extends StackProps {
	environment: "dev" | "staging" | "prod"
}

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: AstroSiteStackProps) {
		super(scope, id, props)

		// Define environment-specific values
		const envConfig = {
			dev: {
				API_URL: "https://api-dev.example.com",
				NODE_ENV: "development",
			},
			staging: {
				API_URL: "https://api-staging.example.com",
				NODE_ENV: "staging",
			},
			prod: {
				API_URL: "https://api.example.com",
				NODE_ENV: "production",
			},
		}

		const config = envConfig[props.environment]

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					environment: {
						...config,
						APP_VERSION: "1.0.0",
					},
				},
			},
		})
	}
}
```

### Using AWS CDK Context

You can also use CDK context values to determine the environment:

```ts
export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const environment = this.node.tryGetContext("environment") ?? "dev"

		const envConfig: Record<string, Record<string, string>> = {
			dev: {
				API_URL: "https://api-dev.example.com",
				NODE_ENV: "development",
			},
			staging: {
				API_URL: "https://api-staging.example.com",
				NODE_ENV: "staging",
			},
			prod: {
				API_URL: "https://api.example.com",
				NODE_ENV: "production",
			},
		}

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					environment: envConfig[environment],
				},
			},
		})
	}
}
```

Then deploy with:

```bash
cdk deploy --context environment=prod
```

## Using AWS Secrets Manager

For sensitive values like API keys, database passwords, or other secrets, use AWS Secrets Manager instead of plain environment variables. This provides better security, automatic rotation support, and audit logging.

### Creating a Secret

First, create a secret in AWS Secrets Manager (via console, CLI, or CDK):

```bash
aws secretsmanager create-secret \
  --name my-app/api-keys \
  --secret-string '{"API_KEY":"your-secret-key","DATABASE_PASSWORD":"your-password"}'
```

### Granting Lambda Access to Secrets

Your Lambda function needs permission to read the secret. Configure this in your CDK stack:

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		// Reference the existing secret
		const apiSecret = Secret.fromSecretNameV2(
			this,
			"ApiSecret",
			"my-app/api-keys",
		)

		const astroAWS = new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					environment: {
						SECRET_ARN: apiSecret.secretArn,
					},
				},
			},
		})

		// Grant the Lambda function permission to read the secret
		if (astroAWS.cdk.lambdaFunction) {
			apiSecret.grantRead(astroAWS.cdk.lambdaFunction)
		}
	}
}
```

### Accessing Secrets in Your Code

In your Astro code, you'll need to fetch the secret from AWS Secrets Manager at runtime:

```ts
// src/utils/secrets.ts
import {
	SecretsManagerClient,
	GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager"

const secretsClient = new SecretsManagerClient({})

let cachedSecret: Record<string, string> | null = null

export async function getSecret(key: string): Promise<string> {
	if (!cachedSecret) {
		const secretArn = import.meta.env.SECRET_ARN
		if (!secretArn) {
			throw new Error("SECRET_ARN environment variable is not set")
		}

		const command = new GetSecretValueCommand({ SecretId: secretArn })
		const response = await secretsClient.send(command)

		if (!response.SecretString) {
			throw new Error("Secret value is not a string")
		}

		cachedSecret = JSON.parse(response.SecretString)
	}

	if (!cachedSecret || !(key in cachedSecret)) {
		throw new Error(`Secret key "${key}" not found`)
	}

	return cachedSecret[key]
}
```

Then use it in your pages or API routes:

```astro
---
// src/pages/api/data.astro
import { getSecret } from "../../utils/secrets"

const apiKey = await getSecret("API_KEY")

// Use the API key to make authenticated requests
const response = await fetch("https://api.example.com/data", {
	headers: {
		Authorization: `Bearer ${apiKey}`,
	},
})

const data = await response.json()
---

<ResponseInit>
	{ status: 200 }
</ResponseInit>
{JSON.stringify(data)}
```

> **Note:** Secrets Manager calls add latency to your requests. Consider caching secret values in memory (as shown above) or using a Lambda layer with cached secrets for better performance.

## Edge Mode Limitations

**Important:** Environment variables are **not supported** in Lambda@Edge mode due to AWS limitations.

When you use `mode: "edge"` in your Astro AWS adapter configuration, environment variables configured in your CDK stack will be automatically removed (`removeInEdge: true`). This is handled automatically by the construct.

### Why Edge Mode Doesn't Support Environment Variables

Lambda@Edge functions have strict limitations:

- **No environment variables**: Lambda@Edge doesn't support environment variables
- **Limited execution time**: 5 seconds for viewer request/response, 30 seconds for origin request/response
- **Smaller package size**: Deployment packages must be smaller
- **No VPC access**: Limited access to AWS services
- **No file system**: Except for `/tmp` directory

### Workarounds for Edge Mode

If you need configuration values in edge mode, consider:

1. **Hardcode values**: For non-sensitive configuration (not recommended for secrets)
2. **Use CloudFront headers**: Pass configuration via CloudFront custom headers
3. **Use query parameters**: Pass configuration via URL parameters (not recommended for sensitive data)
4. **Switch to SSR mode**: Use `mode: "ssr"` or `mode: "ssr-stream"` if you need environment variables

```ts
// astro.config.ts
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "ssr", // Use SSR mode instead of "edge" to support environment variables
	}),
})
```

## Best Practices

### 1. Never Commit Secrets

Never commit sensitive values like API keys, passwords, or tokens to your repository. Always use AWS Secrets Manager or environment variables set at deployment time.

```ts
// ❌ Bad: Hardcoded secrets
environment: {
	API_KEY: "sk_live_1234567890", // Never do this!
}

// ✅ Good: Use Secrets Manager or environment variables
environment: {
	SECRET_ARN: apiSecret.secretArn,
}
```

### 2. Use Different Values for Different Environments

Always use different API endpoints, keys, and configuration for development, staging, and production environments.

### 3. Validate Environment Variables

Validate that required environment variables are present:

```astro
---
// src/pages/index.astro
const apiUrl = import.meta.env.API_URL

if (!apiUrl) {
	throw new Error("API_URL environment variable is required")
}
---
```

### 4. Cache Secrets Appropriately

When using AWS Secrets Manager, cache secret values in memory to avoid repeated API calls. However, be aware that cached values won't update if the secret is rotated.

### 5. Use Type Definitions

Define your environment variables in `src/env.d.ts` for type safety and better developer experience.

### 6. Document Required Variables

Document which environment variables are required in your project's README or documentation:

```markdown
## Required Environment Variables

- `API_URL`: The base URL for the API
- `NODE_ENV`: The environment (development, staging, production)
```

### 7. Use Descriptive Names

Use clear, descriptive names for your environment variables:

```ts
// ❌ Bad: Unclear names
environment: {
	URL: "https://api.example.com",
	KEY: "secret-key",
}

// ✅ Good: Descriptive names
environment: {
	API_BASE_URL: "https://api.example.com",
	STRIPE_API_KEY: "sk_live_...",
}
```

## Complete Example

Here's a complete example showing environment variables configuration with different environments and Secrets Manager integration:

```ts
// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda"

interface AstroSiteStackProps extends StackProps {
	environment: "dev" | "staging" | "prod"
}

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: AstroSiteStackProps) {
		super(scope, id, props)

		// Environment-specific configuration
		const envConfig = {
			dev: {
				API_URL: "https://api-dev.example.com",
				NODE_ENV: "development",
			},
			staging: {
				API_URL: "https://api-staging.example.com",
				NODE_ENV: "staging",
			},
			prod: {
				API_URL: "https://api.example.com",
				NODE_ENV: "production",
			},
		}

		// Reference secret from Secrets Manager
		const apiSecret = Secret.fromSecretNameV2(
			this,
			"ApiSecret",
			`my-app/api-keys-${props.environment}`,
		)

		const astroAWS = new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				lambdaFunction: {
					architecture: Architecture.ARM_64,
					runtime: Runtime.NODEJS_24_X,
					environment: {
						...envConfig[props.environment],
						SECRET_ARN: apiSecret.secretArn,
						APP_VERSION: "1.0.0",
					},
				},
			},
		})

		// Grant Lambda permission to read the secret
		if (astroAWS.cdk.lambdaFunction) {
			apiSecret.grantRead(astroAWS.cdk.lambdaFunction)
		}
	}
}
```

And in your Astro code:

```astro
---
// src/pages/api/data.astro
import { getSecret } from "../../utils/secrets"

const apiUrl = import.meta.env.API_URL
const apiKey = await getSecret("API_KEY")

const response = await fetch(`${apiUrl}/data`, {
	headers: {
		Authorization: `Bearer ${apiKey}`,
	},
})

const data = await response.json()
---

<ResponseInit>
	{ status: 200 }
</ResponseInit>
{JSON.stringify(data)}
```

## Next Steps

- Learn about [enabling SSR](/guides/enabling-ssr) to use environment variables in your Astro application
- Review [configuring deployment](/guides/configuring-deployment) for more Lambda function customization options
- Check out the [API routes guide](/guides/api-routes) to see how environment variables work with API endpoints
- Explore [AWS Secrets Manager documentation](https://docs.aws.amazon.com/secretsmanager/) for advanced secret management features
