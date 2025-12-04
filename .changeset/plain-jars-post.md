---
"@astro-aws/adapter": minor
---

feat: handle invalid/malformed url gracefully

This change adds a safe `decodeURI` check during route matching to prevent unhandled exceptions caused by malformed or invalid percent-encoded URLs.
Previously, invalid paths would cause `decodeURI` to throw, resulting in a 500 Internal Server Error.
With this update, such errors are caught early, allowing the server to return a proper client-error response instead of failing unexpectedly.
