import "#/styles/highlight.scss";
import "#/styles/katex.scss";
import type LayoutProps from "#/types/LayoutProps.js";
import type { Metadata } from "next";
import type { JSX } from "react/jsx-runtime";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Layout({ children }: LayoutProps): JSX.Element {
	return <>{children}</>;
}

export const metadata: Metadata = {
	title: { default: "Article", template: "%s | WebGL Tutorial | Lakuna" }
};
