import type { NextFontWithVariable } from "next/dist/compiled/@next/font";

import { Noto_Serif, Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

/**
 * The font used for quotes.
 * @public
 */
// eslint-disable-next-line new-cap
export const serif: NextFontWithVariable = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-serif"
});

/**
 * The font used for most text.
 * @public
 */
// eslint-disable-next-line new-cap
export const sansSerif: NextFontWithVariable = Ubuntu_Sans({
	subsets: ["latin"],
	variable: "--font-sans-serif"
});

/**
 * The font used for code.
 * @public
 */
// eslint-disable-next-line new-cap
export const monospace: NextFontWithVariable = Ubuntu_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-monospace"
});
