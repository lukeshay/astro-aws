---
"@astro-aws/constructs": minor
---

Migrate CloudFront S3 origin from Origin Access Identity (OAI) to Origin Access Control (OAC).

- Switch from `S3BucketOrigin.withOriginAccessIdentity` to `S3BucketOrigin.withOriginAccessControl` — the AWS-recommended approach with distribution-scoped bucket policies and SSE-KMS support.
- Remove manual S3 bucket policy (CDK now manages this automatically via OAC).
- Deprecate `originAccessIdentity` prop/field (returns `undefined`, will be removed in next major).
