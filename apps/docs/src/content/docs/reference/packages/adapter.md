---
title: "@astro-aws/adapter"
description: "NPM package @astro-aws/adapter"
---


An [Astro](https://astro.build) adapter for building an SSR application and deploying it to AWS Lambda.

## Install

```sh
# Using NPM
npx astro add @astro-aws/adapter

# Using Yarn
yarn astro add @astro-aws/adapter

# Using PNPM
pnpm astro add @astro-aws/adapter

# Using Bun
bun x astro add @astro-aws/adapter
```

### Manually

1. Install the package.

```
# Using NPM
npm install -D @astro-aws/adapter

# Using Yarn
yarn add -D @astro-aws/adapter

# Using PNPM
pnpm add -D @astro-aws/adapter

# Using Bun
bun add -D @astro-aws/adapter
```

2. Add the following to your `astro.config.mjs` file.

```js
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws(),
})
```

### SSR Usage

1. Install the package.

```
# Using NPM
npm install -D @astro-aws/adapter

# Using Yarn
yarn add -D @astro-aws/adapter

# Using PNPM
pnpm add -D @astro-aws/adapter

# Using Bun
bun add -D @astro-aws/adapter
```

2. Add the following to your `astro.config.mjs` file.

```js
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "ssr",
	}),
})
```

### SSR Stream Usage

1. Install the package.

```
# Using NPM
npm install -D @astro-aws/adapter

# Using Yarn
yarn add -D @astro-aws/adapter

# Using PNPM
pnpm add -D @astro-aws/adapter

# Using Bun
bun add -D @astro-aws/adapter
```

2. Add the following to your `astro.config.mjs` file.

```js
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "ssr-stream",
	}),
})
```

### Edge Usage

> **NOTE:** Environment variables are not supported in edge mode. Due to the limitations of AWS Lambda@Edge.

1. Install the package.

```
# Using NPM
npm install -D @astro-aws/adapter

# Using Yarn
yarn add -D @astro-aws/adapter

# Using PNPM
pnpm add -D @astro-aws/adapter

# Using Bun
bun add -D @astro-aws/adapter
```

2. Add the following to your `astro.config.mjs` file.

```js
import { defineConfig } from "astro/config"
import astroAws from "@astro-aws/adapter"

export default defineConfig({
	output: "server",
	adapter: astroAws({
		mode: "edge",
	}),
})
```

## Example

See [the source code of this site](https://github.com/lukeshay/astro-aws/blob/main/apps/www/astro.config.ts)
## More

For more information, see the [documentation website](https://astro-aws.org/)
