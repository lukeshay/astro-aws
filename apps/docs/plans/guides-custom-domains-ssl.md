# Guide: Custom Domains & SSL Certificates

## Overview

Guide users through setting up custom domains with SSL certificates for their Astro AWS deployments.

## Sections

1. Prerequisites (Route53 hosted zone, domain ownership)
2. Creating ACM Certificate (including cross-region for CloudFront)
3. Configuring Domain Names in CloudFront
4. Setting up Route53 DNS Records (A and AAAA)
5. Complete example with code
6. Troubleshooting common issues

## Key Code Examples

- CrossRegionCertificate construct usage
- HostedZone lookup
- ARecord and AaaaRecord creation
- Certificate configuration in CloudFront

## References

- apps/infra/src/lib/stacks/website-stack.ts (lines 65-95, 169-187)
- apps/infra/src/lib/constructs/cross-region-certificate.ts
