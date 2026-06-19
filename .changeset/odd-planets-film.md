---
"@astro-aws/constructs": major
"@astro-aws/adapter": major
---

Support Astro v6 and drop support for older Astro and Node.js versions.

This release requires Astro 6 and Node.js 22 or 24. The adapter uses Astro v6
`entrypointResolution: "auto"` and passes runtime options through an internal
virtual config module.

The adapter externalizes Sharp during the SSR build so Astro Image works with a
Lambda layer at runtime. Attach a Sharp layer matching your Astro version (for
example `0.34.5`) to SSR and SSR-stream functions.

`envGetSecret` is supported in SSR and SSR-stream modes via `setGetEnv()`.
Lambda@Edge does not support Astro secrets.

The adapter uses `middlewareMode: "classic"` and passes `clientAddress` from AWS
request metadata. Astro v6 removed `output: "hybrid"`; use `output: "static"` with
on-demand routes instead.
