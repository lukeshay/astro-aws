import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import aws from "astro-aws";
// import aws from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), react(), tailwind()],
  site: `https://im7onr7drrzm6t7m5ueso57peq0yljit.lambda-url.us-east-1.on.aws/`,
  output: "server",
  adapter: aws(),
});
