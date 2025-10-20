import Link, { type LinkProps } from "./Link";
import type { JSX } from "react";
import multiclass from "util/multiclass";
import style from "./styles/card.module.scss";

/**
 * Properties that can be passed to a card.
 * @public
 */
export type CardProps =
	| (LinkProps & { href: NonNullable<LinkProps["href"]> }) // Guarantee that `href` is present for links.
	| JSX.IntrinsicElements["div"];

/**
 * A card.
 * @param props - The properties to pass to the card.
 * @returns The card.
 * @public
 */
export default function Card({ children, className, ...props }: CardProps) {
	return "href" in props ?
			<Link className={multiclass(className, style["card"])} {...props}>
				<div>{children}</div>
			</Link>
		:	<div className={multiclass(className, style["card"])} {...props}>
				<div>{children}</div>
			</div>;
}
