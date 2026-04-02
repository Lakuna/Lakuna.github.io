import type { NextConfig } from "next";
import type { Configuration } from "webpack";

import createMdx from "@next/mdx";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
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
	webpack: (config: Configuration) => {
		// https://react-svgr.com/docs/next/

		// Find the existing rule that handles SVG imports.
		const svgRule = config.module?.rules?.find(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(rule) =>
				typeof rule === "object" &&
				rule?.test instanceof RegExp &&
				rule.test.test(".svg")
		);

		if (
			typeof svgRule === "object" &&
			svgRule?.issuer &&
			typeof svgRule.resourceQuery === "object" &&
			"not" in svgRule.resourceQuery &&
			Array.isArray(svgRule.resourceQuery.not)
		) {
			// Use the existing rule only for SVG imports ending in `"?url"`.
			config.module?.rules?.push({
				...svgRule,
				resourceQuery: /url/u,
				test: /\.svg$/iu
			});

			// Convert all other SVG imports to React components.
			config.module?.rules?.push({
				issuer: svgRule.issuer,
				resourceQuery: { not: [...svgRule.resourceQuery.not, /url/u] },
				test: /\.svg$/iu,
				use: ["@svgr/webpack"]
			});

			// Modify the file loader rule to ignore SVG imports since we handle it now.
			svgRule.exclude = /\.svg$/iu;
		}

		// Return the modified configuration.
		return config;
	}
});

export default out;
