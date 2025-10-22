import "styles/highlight.scss";
import "styles/katex.scss";
import type { JSX } from "react";
import type LayoutProps from "types/LayoutProps";
import type { Metadata } from "next";

export default function Layout({ children }: LayoutProps): JSX.Element {
	return <>{children}</>;
}

export const metadata = {
	title: { default: "Article", template: "%s | WebGL Tutorial | Lakuna" }
} satisfies Metadata;
