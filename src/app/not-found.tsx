import type { Metadata } from "next";
import style from "./page.module.scss";

export default function NotFound() {
	return (
		<div className={style["content"]}>
			<h1>{"404 Not Found"}</h1>
			<p>{"This isn't the page you're looking for."}</p>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Page not found.",
	title: "404 Not Found"
};
