import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import aws from "@astro-aws/adapter";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	adapter: aws(),
	integrations: [preact(), react(), tailwind(), mdx()],
	output: "server",
	site: `https://im7onr7drrzm6t7m5ueso57peq0yljit.lambda-url.us-east-1.on.aws/`,
});
