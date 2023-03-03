import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import astroAws from "@astro-aws/adapter";

// https://astro.build/config
export default defineConfig({
	adapter: astroAws(),
	integrations: [svelte()],
	output: "server",
});
