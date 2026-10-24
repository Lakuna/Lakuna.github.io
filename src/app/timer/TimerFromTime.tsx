"use client";

import type { JSX } from "react/jsx-runtime";

import { useSearchParams } from "next/navigation";

import Timer from "@/components/Timer";

export default function TimerFromTime(): JSX.Element {
	return (
		<Timer
			showMilliseconds={false}
			time={Number(useSearchParams().get("time"))}
		/>
	);
}
