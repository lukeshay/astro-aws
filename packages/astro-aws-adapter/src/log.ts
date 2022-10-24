import { ADAPTER_NAME } from "./constants";

export const warn = (message: string) => {
	console.warn(`[${ADAPTER_NAME}] ${message}`);
};
