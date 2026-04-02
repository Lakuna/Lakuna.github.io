import type { JSX } from "react/jsx-runtime";

import {
	default as NextLink,
	type LinkProps as NextLinkProps
} from "next/link";

import domain from "@/util/domain";

/**
 * Equivalent to the props that can be passed to a Next.js link or an anchor element.
 * @public
 */
export type LinkProps = JSX.IntrinsicElements["a"] &
	Omit<NextLinkProps, keyof JSX.IntrinsicElements["a"]>;

/**
 * Create a hyperlink. Uses Next.js-style preloading for internal links and HTML anchor elements for external links.
 * @param props - The properties to pass to the link.
 * @returns The link.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Link({
	href,
	onClick,
	onMouseEnter,
	onTouchStart,
	...props
}: LinkProps): JSX.Element {
	// Ensure that required properties are present.
	if (!href) {
		throw new Error("Link reference is required.");
	}

	// Ignore disallowed properties.
	void onMouseEnter;
	void onTouchStart;
	void onClick;

	// Set default properties.
	if (
		!href.startsWith("/") &&
		!href.startsWith("#") &&
		!href.startsWith(".") &&
		!href.startsWith(domain)
	) {
		props.target ??= "_blank";
		props.rel ??= "noreferrer noopener";
	}

	return <NextLink href={href} {...props} />;
}
