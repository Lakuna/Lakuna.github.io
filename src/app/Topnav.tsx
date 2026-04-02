import type { JSX } from "react/jsx-runtime";

import Link from "#/components/Link.js";
import multiclass from "#/util/multiclass.js";

import style from "./topnav.module.scss";

/**
 * Properties that can be passed to the top navigation bar.
 * @public
 */
export type TopnavProps = Omit<JSX.IntrinsicElements["nav"], "children">;

/**
 * The site-wide top navigation bar.
 * @param props - The properties to pass to the navigation bar.
 * @returns The navigation bar.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Topnav({
	className,
	...props
}: TopnavProps): JSX.Element {
	return (
		<nav className={multiclass(className, style["topnav"])} {...props}>
			<ul>
				<li>
					<Link href="/">{"Index"}</Link>
				</li>
				<li>
					<Link href="/blog">{"Blog"}</Link>
				</li>
				<li>
					<Link href="/portfolio">{"Portfolio"}</Link>
				</li>
			</ul>
		</nav>
	);
}
