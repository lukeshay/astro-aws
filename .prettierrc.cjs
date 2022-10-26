const merge = require("@lshay/prettier-config/merge.cjs");

/**
 * @type {import("prettier").Options}
 */
const config = {
	overrides: [
		{
			files: ["*.json", "!package.json"],
			options: {
				jsonRecursiveSort: false,
				plugins: [require("prettier-plugin-sort-json")],
			},
		},
	],
	plugins: [require("prettier-plugin-astro"), require("prettier-plugin-sh"), require("prettier-plugin-jsdoc")],
};

module.exports = merge(config);
