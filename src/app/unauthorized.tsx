import type { Metadata } from "next";
import type { JSX } from "react/jsx-runtime";

import style from "./page.module.scss";

export default function Unauthorized(): JSX.Element {
	return (
		<div className={style["content"]}>
			<h1>{"401 Unauthorized"}</h1>
			<p>{"Who is this? What's your operating number?"}</p>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Unauthorized.",
	title: "401 Unauthorized"
};
