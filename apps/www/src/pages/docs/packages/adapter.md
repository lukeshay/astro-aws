---
layout: ../../../layouts/DocsLayout.astro
section: Packages
title: "@astro-aws/adapter"
---

# @astro-aws/adapter

An [Astro](https://astro.build) adapter for building an SSR application and deploying it to AWS Lambda.

## Install

```sh
# Using NPM
npx astro add @astro-aws/adapter

# Using Yarn
yarn astro add @astro-aws/adapter

# Using PNPM
pnpm astro add @astro-aws/adapter
```

### Manually

1. Install the package.

```
# Using NPM
npm install @astro-aws/adapter

# Using Yarn
yarn add @astro-aws/adapter

# Using PNPM
pnpm add @astro-aws/adapter
```

2. Add the following to your `astro.config.mjs` file.

```js
import { defineConfig } from "astro/config";
import astroAws from "@astro-aws/adapter";

export default defineConfig({
	output: "server",
	adapter: astroAws(),
});
```

## Args

```ts
type Args = {
	binaryMediaTypes?: string[];
};
```

### `binaryMediaTypes?: string[];`

Specifies what media types need to be base64 encoded.
