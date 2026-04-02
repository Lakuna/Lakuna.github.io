import type { MDXComponents } from "mdx/types";

import Link from "@/components/Link";

/** @see {@link https://nextjs.org/docs/app/guides/mdx} */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/naming-convention
export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
	a: (props) => <Link {...props} />,
	...components
});
