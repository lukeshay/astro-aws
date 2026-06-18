---
"@astro-aws/constructs": major
"@astro-aws/adapter": major
---

Support Astro v6 and drop support for older Astro and Node.js versions.

This release requires Astro 6 and Node.js 22 or 24. The adapter continues to
use Astro's deprecated `entrypointResolution: "explicit"` compatibility path for
now; migrating to `entrypointResolution: "auto"` is planned as a follow-up.

The adapter externalizes Sharp during the SSR build so Astro Image works with a
Lambda layer at runtime. Attach a Sharp layer matching your Astro version (for
example `0.34.5`) to SSR and SSR-stream functions.
