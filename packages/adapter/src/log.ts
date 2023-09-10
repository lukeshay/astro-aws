import { ADAPTER_NAME } from "./constants.js"

export const warn = (message?: unknown, ...optionalParams: unknown[]) => {
	console.warn(`[${ADAPTER_NAME}]`, message, ...optionalParams)
}

export const log = (message?: unknown, ...optionalParams: unknown[]) => {
	console.log(`[${ADAPTER_NAME}]`, message, ...optionalParams)
}
