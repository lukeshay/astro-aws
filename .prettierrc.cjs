const merge = require("@lshay/prettier-config/merge.cjs");

module.exports = merge({
	plugins: [require("prettier-plugin-astro"), require("prettier-plugin-sh")],
});
