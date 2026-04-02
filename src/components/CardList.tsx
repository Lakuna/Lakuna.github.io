import type { JSX } from "react/jsx-runtime";

import multiclass from "@/util/multiclass";

import style from "./styles/card-list.module.scss";

export type CardListProps = JSX.IntrinsicElements["ul"];

/**
 * An unordered list of cards.
 * @param props - The properties to pass to the card list.
 * @returns The card list.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function CardList({
	className,
	...props
}: CardListProps): JSX.Element {
	return (
		<ul className={multiclass(className, style["card-list"])} {...props} />
	);
}
