import type { JSX } from "react";
import type { Metadata } from "next";
import style from "./page.module.scss";

export default function Forbidden(): JSX.Element {
	return (
		<div className={style["content"]}>
			<h1>{"403 Forbidden"}</h1>
			<p>{"We don't serve your kind here."}</p>
		</div>
	);
}

export const metadata = {
	description: "Page forbidden.",
	title: "403 Forbidden"
} satisfies Metadata;
