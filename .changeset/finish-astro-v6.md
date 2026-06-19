---
"@astro-aws/adapter": minor
"@astro-aws/constructs": minor
---

Complete the Astro v6 adapter contract.

The adapter migrates to `entrypointResolution: "auto"` with a virtual runtime config
module, wires `envGetSecret` for SSR and SSR-stream modes via `setGetEnv()`, uses
`middlewareMode: "classic"`, and passes `clientAddress` from AWS request metadata.
Lambda@Edge does not support Astro secrets.
