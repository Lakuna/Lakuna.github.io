import { configs, parser, plugin } from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-plugin-prettier/recommended";

/**
 * ESLint configuration options.
 * @type {import("@eslint/core").ConfigObject[]}
 * @internal
 */
const out = defineConfig(
	// Next.js ESLint rules.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	...nextVitals,

	// Enable all ESLint rules.
	eslint.configs.all,

	// Disable specific rules.
	{
		rules: {
			// Possible Problems
			// N/A

			// Suggestions
			complexity: "off",
			"id-length": "off",
			"max-depth": "off",
			"max-lines": "off",
			"max-lines-per-function": "off",
			"max-nested-callbacks": "off",
			"max-params": "off",
			"max-statements": "off",
			"no-bitwise": "off",
			"no-continue": "off",
			"no-div-regex": "off",
			"no-inline-comments": "off",
			"no-label-var": "off",
			"no-labels": "off",
			"no-magic-numbers": "off",
			"no-nested-ternary": "off",
			"no-plusplus": "off",
			"no-shadow": "off", // Must use `@typescript-eslint/no-shadow` instead.
			"no-ternary": "off",
			"no-undef-init": "off",
			"no-void": "off",
			"no-warning-comments": "off",
			"one-var": ["error", "never"]

			// Layout and Formatting
			// N/A
		}
	},

	// Enable type checking and related rules.
	...configs.strictTypeChecked,
	...configs.stylisticTypeChecked,
	{
		languageOptions: {
			parser,
			parserOptions: { ecmaVersion: "latest", project: true }
		},
		plugins: { "@typescript-eslint": plugin },
		rules: { "@typescript-eslint/no-shadow": "error" }
	},

	// Enable the Prettier plugin.
	prettier // Includes `eslint-config-prettier` and `eslint-plugin-prettier`.
);

export default out;
