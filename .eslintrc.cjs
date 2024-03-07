require("@rushstack/eslint-patch/modern-module-resolution")

const { createSmartConfig } = require("@lshay/eslint-config")

/** @type {import("eslint").Linter.Config} */
module.exports = createSmartConfig({
	overrides: [
		{
			files: ["*.test.*"],
			rules: {
				"@typescript-eslint/no-unsafe-assignment": "off",
			},
		},
	],
	root: true,
	rules: {
		"import/no-useless-path-segments": "off",
		"no-console": "off",
		"no-warning-comments": "off",
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx", ".js", ".jsx"],
		},
		"import/resolver": {
			typescript: {
				project: [
					"apps/*/jsconfig.json",
					"apps/*/tsconfig.json",
					"packages/*/jsconfig.json",
					"packages/*/tsconfig.json",
				],
			},
		},
	},
})
