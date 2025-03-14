import type { Configuration } from "webpack";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import createMDX from "@next/mdx";
import glsl from "highlight.js/lib/languages/glsl";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/**
 * Next.js configuration options.
 * @internal
 */
export default createMDX({
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
	experimental: {
		turbo: { rules: { "*.svg": { as: "*.js", loaders: ["@svgr/webpack"] } } }
	},
	pageExtensions: ["mdx", "ts", "tsx"],
	webpack: (config: Configuration) => {
		// Find the existing rule that handles SVG imports.
		const fileLoaderRule = config.module?.rules?.find(
			(rule) =>
				typeof rule === "object" &&
				rule?.test instanceof RegExp &&
				rule.test.test(".svg")
		);

		if (
			typeof fileLoaderRule === "object" &&
			fileLoaderRule?.issuer &&
			typeof fileLoaderRule.resourceQuery === "object" &&
			"not" in fileLoaderRule.resourceQuery
		) {
			// Use the existing rule only for SVG imports ending in `"?url"`.
			config.module?.rules?.push({
				...fileLoaderRule,
				resourceQuery: /url/u,
				test: /\.svg$/iu
			});

			// Convert all other SVG imports to React components.
			config.module?.rules?.push({
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [fileLoaderRule.resourceQuery.not, /url/u] },
				test: /\.svg$/iu,
				use: ["@svgr/webpack"]
			});

			// Modify the file loader rule to ignore SVG imports since we handle it now.
			fileLoaderRule.exclude = /\.svg$/iu;
		}

		// Return the modified configuration.
		return config;
	}
});
