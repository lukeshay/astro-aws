import { stringify } from "flatted"

import type { RuntimeConfig } from "./runtime-config.js"

const VIRTUAL_CONFIG_ID = "virtual:@astro-aws/adapter:config"
const RESOLVED_VIRTUAL_CONFIG_ID = `\0${VIRTUAL_CONFIG_ID}`

type VitePlugin = {
	load: (id: string) => string | undefined
	name: string
	resolveId: (id: string) => string | undefined
}

const createConfigPlugin = (config: RuntimeConfig): VitePlugin => {
	const serialized = stringify(config)

	return {
		load(id) {
			if (id !== RESOLVED_VIRTUAL_CONFIG_ID) {
				return undefined
			}

			return `export const serializedConfig = ${JSON.stringify(serialized)};`
		},
		name: "@astro-aws/adapter-config",
		resolveId(id) {
			if (id === VIRTUAL_CONFIG_ID) {
				return RESOLVED_VIRTUAL_CONFIG_ID
			}

			return undefined
		},
	}
}

export { VIRTUAL_CONFIG_ID, createConfigPlugin }
