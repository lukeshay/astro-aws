---
"@astro-aws/adapter": patch
---

Validate and sanitize forwarded URL inputs before processing

- Add validation for `x-forwarded-protocol` and `x-forwarded-host` headers to prevent invalid or malicious URLs.
- Prevent exceptions caused by invalid URLs constructed from manipulated headers.
- Fixes security issue where user-controlled headers could lead to invalid URL usage.
