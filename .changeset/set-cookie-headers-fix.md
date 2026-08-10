---
"@astro-aws/adapter": patch
---

Emit every set-cookie header from lambda and edge responses. Previously, cookies set directly on the response headers (rather than via `Astro.cookies`) were ignored.
