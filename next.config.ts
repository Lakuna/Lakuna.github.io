import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";
import type { Configuration, RuleSetRule } from "webpack";

import createMdx from "@next/mdx";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import glsl from "highlight.js/lib/languages/glsl";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { WEBPACK_LAYERS } from "next/dist/lib/constants";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/**
 * Test a Webpack rule against an input value.
 * @see {@link https://webpack.js.org/configuration/module/#condition}
 * @internal
 */
const webpackRuleTest = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	rule: 0 | "" | "..." | false | null | RuleSetRule | undefined,
	input: string
): boolean =>
	typeof rule === "object" &&
	typeof rule?.test !== "undefined" &&
	(typeof rule.test === "string" ? input.startsWith(rule.test)
	: rule.test instanceof RegExp ? rule.test.test(input)
	: typeof rule.test === "function" ? rule.test(input)
	: Array.isArray(rule.test) ?
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		rule.test.some((test) => webpackRuleTest({ test }, input))
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	:	(rule.test.and?.every((test) => webpackRuleTest({ test }, input)) ?? true) &&
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		(rule.test.or?.some((test) => webpackRuleTest({ test }, input)) ?? true) &&
		(rule.test.not ? !webpackRuleTest({ test: rule.test.not }, input) : true));

/**
 * Add the Webpack rule to enable SVGR.
 * @see {@link https://react-svgr.com/docs/next/}
 * @internal
 */
const svgrConfig = <T extends Configuration>(config: T): T => {
	if (!config.module?.rules) {
		throw new Error("No Webpack config rules.");
	}

	// Find the existing rule that handles SVG imports.
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	const fileLoaderRule = config.module.rules.find((rule) =>
		webpackRuleTest(rule, ".svg")
	);
	if (typeof fileLoaderRule !== "object" || fileLoaderRule === null) {
		throw new Error("Invalid existing Webpack SVG rule.");
	}

	const rule: RuleSetRule = { test: /\.svg$/iu, use: ["@svgr/webpack"] };
	if (fileLoaderRule.issuer) {
		rule.issuer = fileLoaderRule.issuer;
	}
	if (
		typeof fileLoaderRule.resourceQuery === "object" &&
		"not" in fileLoaderRule.resourceQuery &&
		Array.isArray(fileLoaderRule.resourceQuery.not)
	) {
		rule.resourceQuery = { not: [...fileLoaderRule.resourceQuery.not, /url/u] };
	}

	config.module.rules.push(
		// Use the existing rule only for SVG imports ending in `"?url"`.
		{ ...fileLoaderRule, resourceQuery: /url/u, test: /\.svg$/iu },
		// Convert all other SVG imports to React components.
		rule
	);

	// Modify the file loader rule to ignore SVG imports since we handle it now.
	fileLoaderRule.exclude = /\.svg$/iu;

	// Return the modified configuration.
	return config;
};

/**
 * Add the Webpack rule to fix metadata.
 * @see {@link https://github.com/vercel/next.js/issues/91735#issuecomment-4745644823}
 * @internal
 */
const mdxConfig = <T extends Configuration>(
	config: T,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	{ isServer }: WebpackConfigContext
): T => {
	if (!isServer) {
		return config;
	}

	const patch = (
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		rules: (0 | "" | "..." | false | null | RuleSetRule | undefined)[]
	): void => {
		for (const rule of rules) {
			if (typeof rule !== "object" || rule === null) {
				continue;
			}

			if (webpackRuleTest(rule, "page.mdx")) {
				const uses = Array.isArray(rule.use) ? rule.use : [rule.use];
				for (const entry of uses) {
					if (
						typeof entry !== "object" ||
						!entry?.loader?.includes("next-swc-loader") ||
						typeof entry.options !== "object" ||
						entry.options["bundleLayer"]
					) {
						continue;
					}

					entry.options["bundleLayer"] = WEBPACK_LAYERS.reactServerComponents;
				}
			}

			if (rule.oneOf) {
				patch(rule.oneOf);
			}

			if (rule.rules) {
				patch(rule.rules);
			}
		}
	};

	if (config.module?.rules) {
		patch(config.module.rules);
	}

	return config;
};

/**
 * Next.js configuration options.
 * @internal
 */
const out: NextConfig = createMdx({
	// These options can't be serializable, so must use Webpack over Turbopack for now.
	options: {
		rehypePlugins: [
			rehypeKatex,
			[rehypeHighlight, { languages: { bash, c, glsl, javascript, python } }]
		],
		remarkPlugins: [
			remarkFrontmatter,
			[remarkMdxFrontmatter, { name: "metadata" }],
			remarkMath
		]
	}
})({
	pageExtensions: ["mdx", "tsx"],
	reactCompiler: true,
	trailingSlash: false,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	turbopack: { rules: { "*.svg": { as: "*.js", loaders: ["@svgr/webpack"] } } },
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	webpack: (config: Configuration, context: WebpackConfigContext) =>
		mdxConfig(svgrConfig(config), context)
});

export default out;
