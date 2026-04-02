import type { JSX } from "react/jsx-runtime";

import multiclass from "@/util/multiclass";

import Link, { type LinkProps } from "./Link";
import style from "./styles/card.module.scss";

/**
 * Properties that can be passed to a card.
 * @public
 */
export type CardProps =
	| JSX.IntrinsicElements["div"] // Guarantee that `href` is present for links.
	| (LinkProps & { href: NonNullable<LinkProps["href"]> });

/**
 * A card.
 * @param props - The properties to pass to the card.
 * @returns The card.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Card({
	children,
	className,
	...props
}: CardProps): JSX.Element {
	return "href" in props ?
			<Link className={multiclass(className, style["card"])} {...props}>
				<div>{children}</div>
			</Link>
		:	<div className={multiclass(className, style["card"])} {...props}>
				<div>{children}</div>
			</div>;
}
