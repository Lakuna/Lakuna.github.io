import Content from "./content.mdx";
import generateMetadata from "#generateMetadata";
import "#highlight";
import "#katex";
import type { Metadata } from "next";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return <Content />;
}

export const metadata: Metadata = generateMetadata(
	"Fast Inverse Square Root | Blog | Lakuna",
	"An explanation of the famous fast inverse square root algorithm as it is implemented in Quake III Arena.",
	"/favicon.png",
	"/a/q_rsqrt"
);
