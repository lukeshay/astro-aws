require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: ["@lshay/eslint-config"],
	root: true,
	rules: {
		"import/no-useless-path-segments": "off",
		"no-console": "off",
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
}
