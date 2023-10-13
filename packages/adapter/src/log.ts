import { env } from "node:process"

import { ADAPTER_NAME } from "./constants.js"

const LogLevels: Record<string, number | undefined> = {
	DEBUG: 1,
	INFO: 2,
	WARN: 3,
	// eslint-disable-next-line sort-keys
	ERROR: 4,
}

const logLevel = LogLevels[env.ASTRO_AWS_LOG_LEVEL ?? "INFO"] ?? 2

const debug = (message?: unknown, ...optionalParams: unknown[]) => {
	if (logLevel <= 1) {
		console.debug(`[${ADAPTER_NAME}]`, message, ...optionalParams)
	}
}

const warn = (message?: unknown, ...optionalParams: unknown[]) => {
	if (logLevel <= 3) {
		console.warn(`[${ADAPTER_NAME}]`, message, ...optionalParams)
	}
}

const log = (message?: unknown, ...optionalParams: unknown[]) => {
	if (logLevel <= 2) {
		console.log(`[${ADAPTER_NAME}]`, message, ...optionalParams)
	}
}

export { warn, log, debug }
