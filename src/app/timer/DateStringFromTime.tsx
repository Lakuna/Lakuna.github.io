"use client";

import type { JSX } from "react/jsx-runtime";

import { useSearchParams } from "next/navigation";

export default function DateStringFromTime(): JSX.Element {
	return (
		<span>
			{new Date(Number(useSearchParams().get("time"))).toLocaleString()}
		</span>
	);
}
