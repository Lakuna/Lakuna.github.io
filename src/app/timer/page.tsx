import type { Metadata } from "next";
import type { JSX } from "react/jsx-runtime";

import DateStringFromTime from "./DateStringFromTime";
import style from "./page.module.scss";
import TimerFromTime from "./TimerFromTime";

export default function Page(): JSX.Element {
	return (
		<div className={style["content"]}>
			<h1>
				{`Countdown Timer to `}
				<DateStringFromTime />
			</h1>
			<div className={style["timer"]}>
				<TimerFromTime />
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description: "A countdown timer.",
	openGraph: { url: "/timer" },
	title: "Countdown Timer"
};
