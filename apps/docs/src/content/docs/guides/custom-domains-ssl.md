---
title: Custom Domains & SSL Certificates
description: Learn how to set up custom domains with SSL certificates for your Astro AWS deployments using Route53 and ACM.
---

## Overview

Astro AWS supports custom domains with SSL certificates for your CloudFront distributions. This guide walks you through setting up a custom domain with SSL certificate provisioning and DNS record configuration using AWS Route53 and AWS Certificate Manager (ACM).

When you configure a custom domain, you'll:

- Create an SSL certificate in ACM in the `us-east-1` region (required for CloudFront)
- Configure your CloudFront distribution to use the custom domain and certificate
- Set up Route53 DNS records (A and AAAA) to point your domain to CloudFront

## Prerequisites

Before setting up a custom domain, ensure you have:

1. **A registered domain name** - Your domain must be registered with a domain registrar
2. **Route53 hosted zone** - A hosted zone must exist in Route53 for your domain
3. **Domain ownership** - You must have access to manage DNS records for your domain

### Creating a Route53 Hosted Zone

If you don't already have a hosted zone for your domain:

1. Go to the AWS Route53 console
2. Click "Hosted zones" → "Create hosted zone"
3. Enter your domain name (e.g., `example.com`)
4. Choose "Public hosted zone" (for internet-facing domains)
5. Click "Create hosted zone"

**Note**: If your domain is registered with a different registrar, you'll need to update your domain's nameservers to point to the Route53 nameservers shown in the hosted zone.

## Understanding Cross-Region Certificates

CloudFront requires SSL certificates to be in the `us-east-1` region, regardless of where your CDK stack is deployed. This is an AWS requirement for CloudFront distributions.

When creating certificates for CloudFront, you have two options:

1. **Create the certificate in a separate stack in `us-east-1`** - Recommended for most cases
2. **Use DNS-validated certificates** - Automatically handles DNS validation records

This guide shows you how to create certificates in the correct region and configure them with your CloudFront distribution.

## Basic Custom Domain Setup

Here's a minimal example of setting up a custom domain. Since CloudFront requires certificates in `us-east-1`, we'll create the certificate in a separate stack:

```ts ins={5-6,9-10,13-14,17-18,21-30,33-35,38-48}
// lib/certificate-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager"
import { HostedZone } from "aws-cdk-lib/aws-route53"

export class CertificateStack extends Stack {
	public readonly certificate: Certificate

	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, { ...props, env: { ...props.env, region: "us-east-1" } })

		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: "example.com",
		})

		this.certificate = new Certificate(this, "Certificate", {
			domainName: "example.com",
			subjectAlternativeNames: ["www.example.com"],
			validation: CertificateValidation.fromDns(hostedZone),
		})
	}
}

// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import { CertificateStack } from "./certificate-stack"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		// Create certificate stack in us-east-1
		const certificateStack = new CertificateStack(this, "CertificateStack", {
			env: { region: "us-east-1" },
		})

		const domainNames = ["example.com", "www.example.com"]

		new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					certificate: certificateStack.certificate,
					domainNames,
				},
			},
		})
	}
}
```

## Setting Up DNS Records

After configuring the certificate and CloudFront distribution, you need to set up DNS records to point your domain to CloudFront. You can automatically create these records using CDK:

```ts ins={5-7,9-10,13-14,17-18,21-30,33-35,38-48,51-66}
// lib/certificate-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager"
import { HostedZone } from "aws-cdk-lib/aws-route53"

export class CertificateStack extends Stack {
	public readonly certificate: Certificate

	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, { ...props, env: { ...props.env, region: "us-east-1" } })

		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: "example.com",
		})

		this.certificate = new Certificate(this, "Certificate", {
			domainName: "example.com",
			subjectAlternativeNames: ["www.example.com"],
			validation: CertificateValidation.fromDns(hostedZone),
		})
	}
}

// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	HostedZone,
	ARecord,
	AaaaRecord,
	RecordTarget,
} from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import { CertificateStack } from "./certificate-stack"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		// Look up your Route53 hosted zone
		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: "example.com",
		})

		// Create certificate stack in us-east-1
		const certificateStack = new CertificateStack(this, "CertificateStack", {
			env: { region: "us-east-1" },
		})

		const domainNames = ["example.com", "www.example.com"]

		const astroAws = new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					certificate: certificateStack.certificate,
					domainNames,
				},
			},
		})

		// Create DNS records for each domain
		domainNames.forEach((domainName) => {
			// A record for IPv4
			new ARecord(this, `ARecord-${domainName}`, {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAws.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})

			// AAAA record for IPv6
			new AaaaRecord(this, `AaaaRecord-${domainName}`, {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAws.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})
		})
	}
}
```

## Certificate Validation

ACM certificates require DNS validation to prove domain ownership. When using `CertificateValidation.fromDns(hostedZone)`, CDK automatically creates the DNS validation records in your Route53 hosted zone.

The certificate validation process:

1. CDK requests the certificate with DNS validation
2. CDK automatically creates CNAME records in your Route53 hosted zone
3. AWS validates the certificate (typically within a few minutes)
4. The certificate becomes available for use

**Note**: If you're not using `CertificateValidation.fromDns()`, you'll need to manually add validation records:

1. Go to AWS Certificate Manager console (in `us-east-1` region)
2. Select your certificate
3. Click "Create record in Route53" for each validation record, or manually copy the CNAME records
4. Add these records to your Route53 hosted zone

## Multiple Domains and Subdomains

You can configure multiple domains or subdomains using the `subjectAlternativeNames` parameter:

```ts ins={17-18,21-30}
// In CertificateStack constructor
this.certificate = new Certificate(this, "Certificate", {
	domainName: "example.com",
	subjectAlternativeNames: [
		"www.example.com",
		"api.example.com",
		"blog.example.com",
	],
	validation: CertificateValidation.fromDns(hostedZone),
})

// In AstroSiteStack constructor
const domainNames = [
	"example.com",
	"www.example.com",
	"api.example.com",
	"blog.example.com",
]
```

All domains will be included in a single certificate (SAN certificate), and DNS records will be created for each domain.

## Complete Example

Here's a complete example that sets up a custom domain with SSL certificate and DNS records:

```ts ins={1,5-10,13-14,17-18,21-30,33-35,38-48,51-66}
// lib/certificate-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager"
import { HostedZone } from "aws-cdk-lib/aws-route53"

export class CertificateStack extends Stack {
	public readonly certificate: Certificate

	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, { ...props, env: { ...props.env, region: "us-east-1" } })

		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: "example.com",
		})

		this.certificate = new Certificate(this, "Certificate", {
			domainName: "example.com",
			subjectAlternativeNames: ["www.example.com"],
			validation: CertificateValidation.fromDns(hostedZone),
		})
	}
}

// lib/astro-site-stack.ts
import { Stack } from "aws-cdk-lib"
import type { StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { AstroAWS } from "@astro-aws/constructs"
import {
	HostedZone,
	ARecord,
	AaaaRecord,
	RecordTarget,
} from "aws-cdk-lib/aws-route53"
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets"
import { ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront"
import { CertificateStack } from "./certificate-stack"

export class AstroSiteStack extends Stack {
	public constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const hostedZoneName = "example.com"
		const aliases = ["", "www"] // Empty string for root domain

		// Look up Route53 hosted zone
		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName: hostedZoneName,
		})

		// Build full domain names
		const domainNames = aliases
			.map((alias) => [alias, hostedZoneName].filter(Boolean).join("."))
			.filter(Boolean) as [string, ...string[]]

		// Create certificate stack in us-east-1
		const certificateStack = new CertificateStack(this, "CertificateStack", {
			env: { region: "us-east-1" },
		})

		// Create Astro AWS construct with custom domain
		const astroAws = new AstroAWS(this, "AstroAWS", {
			websiteDir: "../my-astro-project",
			cdk: {
				cloudfrontDistribution: {
					certificate: certificateStack.certificate,
					domainNames,
					defaultBehavior: {
						viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					},
				},
			},
		})

		// Create DNS records for each domain
		domainNames.forEach((domainName) => {
			new ARecord(this, `ARecord-${domainName}`, {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAws.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})

			new AaaaRecord(this, `AaaaRecord-${domainName}`, {
				recordName: domainName,
				target: RecordTarget.fromAlias(
					new CloudFrontTarget(astroAws.cdk.cloudfrontDistribution),
				),
				zone: hostedZone,
			})
		})
	}
}
```

## Troubleshooting

### Certificate Validation Fails

**Problem**: Certificate remains in "Pending validation" status.

**Solutions**:

- Verify DNS validation records are correctly added to Route53
- Check that the validation records match exactly what ACM provides
- Ensure your Route53 hosted zone is properly configured
- Wait a few minutes for DNS propagation

### CloudFront Distribution Shows "Invalid Certificate"

**Problem**: CloudFront distribution fails to deploy with certificate errors.

**Solutions**:

- Ensure the certificate is in `us-east-1` region (required for CloudFront)
- Verify the certificate is in "Issued" status before deploying
- Check that all domain names match between certificate and CloudFront configuration
- Ensure the certificate includes all domains you're using

### DNS Records Not Resolving

**Problem**: Domain doesn't resolve to CloudFront distribution.

**Solutions**:

- Verify A and AAAA records are created in Route53
- Check that the records point to the correct CloudFront distribution
- Ensure your domain's nameservers point to Route53
- Wait for DNS propagation (can take up to 48 hours, but usually much faster)
- Use `dig` or `nslookup` to verify DNS resolution

### Certificate Takes Too Long to Issue

**Problem**: Certificate validation takes longer than expected.

**Solutions**:

- DNS validation typically completes within minutes after adding validation records
- Check that validation records are correctly formatted
- Verify Route53 hosted zone is accessible
- Ensure there are no typos in domain names

### Multiple Domains Not Working

**Problem**: Some domains work but others don't.

**Solutions**:

- Verify all domains are included in the certificate's `alternateNames`
- Check that DNS records exist for all domains
- Ensure all domains are listed in CloudFront `domainNames`
- Verify each domain has proper validation records

## Best Practices

1. **Always use HTTPS**: Configure `ViewerProtocolPolicy.REDIRECT_TO_HTTPS` to ensure all traffic uses SSL
2. **Include www and root domain**: Set up both `example.com` and `www.example.com` for better user experience
3. **Use Route53 for DNS**: Route53 integrates seamlessly with ACM and CloudFront
4. **Monitor certificate expiration**: ACM certificates auto-renew, but monitor expiration dates
5. **Test DNS propagation**: Use tools like `dig` or online DNS checkers to verify DNS changes
6. **Keep certificate in us-east-1**: Always use `us-east-1` for CloudFront certificates, even if your stack is in another region

## Next Steps

- Learn about [configuring deployment](/guides/configuring-deployment) for more CloudFront customization options
- Review [security headers and CSP](/guides/security-headers-csp) to enhance your site's security
- Check out [performance optimization](/guides/performance-optimization) to improve your site's speed
