import Link from "components/Link";
import type { MDXComponents } from "mdx/types";

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
	a: (props) => <Link {...props} />,
	...components
});
