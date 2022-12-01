import { ADAPTER_NAME } from "./constants.js";

export const warn = (message: string) => {
	console.warn(`[${ADAPTER_NAME}] ${message}`);
};
