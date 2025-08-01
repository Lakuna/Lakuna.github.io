import type { JSX } from "react";
import type { Metadata } from "next";
import style from "./page.module.scss";

export default function NotFound(): JSX.Element {
	return (
		<div className={style["content"]}>
			<h1>{"404 Not Found"}</h1>
			<p>{"This isn't the page you're looking for."}</p>
		</div>
	);
}

export const metadata = {
	description: "Page not found.",
	title: "404 Not Found"
} satisfies Metadata;
