import type { JSX } from "react/jsx-runtime";

import { useEffect, useRef, useState } from "react";

/**
 * Properties that can be passed to a timer.
 * @public
 */
export type TimerProps = JSX.IntrinsicElements["span"] & {
	/** Prevent children from being passed to the timer. */
	children?: never;

	/** Whether or not to display milliseconds on the timer. */
	showMilliseconds?: boolean;

	/** The Unix timestamp of the end of the timer. */
	time: number;
};

const remainderToString = (
	remainder: number,
	showMilliseconds = true
): string => {
	const milliseconds = Math.trunc(remainder) % 1000;
	const seconds = Math.trunc(remainder / 1000) % 60;
	const minutes = Math.trunc(remainder / 1000 / 60) % 60;
	const hours = Math.trunc(remainder / 1000 / 60 / 60);

	const p = (n: number): string => Math.abs(n).toFixed().padStart(2, "0");
	return `${remainder < 0 ? "-" : ""}${p(hours)}:${p(minutes)}:${p(seconds)}${showMilliseconds ? `.${p(milliseconds)}` : ""}`;
};

/**
 * A timer.
 * @param props - The properties to pass to the timer.
 * @returns The timer.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Timer({
	showMilliseconds,
	time,
	...props
}: TimerProps): JSX.Element {
	const animationFrame = useRef(0);
	const [remainder, setRemainder] = useState(0);

	useEffect(() => {
		const tick = (): void => {
			animationFrame.current = requestAnimationFrame(tick);
			setRemainder(time - Date.now());
		};

		animationFrame.current = requestAnimationFrame(tick);

		return (): void => {
			cancelAnimationFrame(animationFrame.current);
		};
	});

	return (
		<span {...props}>{remainderToString(remainder, showMilliseconds)}</span>
	);
}
