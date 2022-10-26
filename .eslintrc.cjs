require("@rushstack/eslint-patch/modern-module-resolution");

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	extends: "@lshay/eslint-config",
	root: true,
	rules: {
		"no-console": "off",
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			typescript: {
				project: ["packages/*/tsconfig.json", "apps/*/tsconfig.json"],
			},
		},
	},
};
