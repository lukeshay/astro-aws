---
"@astro-aws/constructs": major
---

Migrate CloudFront S3 origin from Origin Access Identity (OAI) to Origin Access Control (OAC).

- Switch from `S3BucketOrigin.withOriginAccessIdentity` to `S3BucketOrigin.withOriginAccessControl` — the AWS-recommended approach with distribution-scoped bucket policies and SSE-KMS support.
- Remove manual S3 bucket policy (CDK now manages this automatically via OAC).
- **Breaking**: `originAccessIdentity` has been removed from `AstroAWSOriginProps` and `AstroAWSS3BucketCdk`. Remove any references to this field from your code.
