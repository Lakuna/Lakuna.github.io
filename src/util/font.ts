// eslint-disable-next-line camelcase
import { Noto_Serif, Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

/**
 * The font used for quotes.
 * @public
 */
// eslint-disable-next-line new-cap
export const serif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-serif"
});

/**
 * The font used for most text.
 * @public
 */
// eslint-disable-next-line new-cap
export const sansSerif = Ubuntu_Sans({
	subsets: ["latin"],
	variable: "--font-sans-serif"
});

/**
 * The font used for code.
 * @public
 */
// eslint-disable-next-line new-cap
export const monospace = Ubuntu_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-monospace"
});
