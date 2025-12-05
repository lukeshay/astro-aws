---
"@astro-aws/adapter": minor
---

feat: support custom 4xx error handling behavior

This change introduces a configurable option for handling 404 errors. Previously, 404 responses always triggered a redirect to the /404 page.
With this update, users can opt to render the “Not Found” page in-place without navigating away.
