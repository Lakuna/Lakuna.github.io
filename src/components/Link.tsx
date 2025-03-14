import {
	default as NextLink,
	type LinkProps as NextLinkProps
} from "next/link";
import type { JSX } from "react";
import domain from "util/domain";

/**
 * Equivalent to the props that can be passed to a Next.js link or an anchor element.
 * @public
 */
export type LinkProps = Omit<NextLinkProps, keyof JSX.IntrinsicElements["a"]> &
	JSX.IntrinsicElements["a"];

/**
 * Create a hyperlink. Uses Next.js-style preloading for internal links and HTML anchor elements for external links.
 * @param props - The properties to pass to the link.
 * @returns The link.
 * @public
 */
export default function Link({
	href,
	onMouseEnter,
	onTouchStart,
	onClick,
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
