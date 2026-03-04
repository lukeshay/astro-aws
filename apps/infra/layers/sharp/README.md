# Sharp Lambda Layer

This directory stores versioned Sharp layer zip files used by `apps/infra` website stacks.

Build a layer zip:

```sh
bash ./scripts/build-sharp-layer.sh 0.34.0
```

The command generates `apps/infra/layers/sharp/sharp-v<version>.zip`.

The `WebsiteStack` attaches this layer for `ssr` and `ssr-stream` deployments only.
