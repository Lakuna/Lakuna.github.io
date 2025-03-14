import type { JSX } from "react";
import multiclass from "util/multiclass";
import style from "./styles/card-list.module.scss";

/**
 * An unordered list of cards.
 * @param props - The properties to pass to the card list.
 * @returns The card list.
 * @public
 */
export default function CardList({
	className,
	...props
}: JSX.IntrinsicElements["ul"]) {
	return (
		<ul className={multiclass(className, style["card-list"])} {...props} />
	);
}
