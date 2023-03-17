import { cwd } from "node:process";

import { cosmiconfig } from "cosmiconfig";

type Config = {
	clean?: string[];
	build?: {
		skipTsc?: boolean;
		skipClean?: boolean;
		bundle?: boolean;
	};
};

const readConfig = async (): Promise<Config> => {
	const result = await cosmiconfig("cli").search(cwd());

	return (result?.config as Config | undefined) ?? {};
};

export { type Config, readConfig };
