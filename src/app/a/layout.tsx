import type LayoutProps from "#/types/LayoutProps.js";
import type { Metadata } from "next";
import type { JSX } from "react/jsx-runtime";

import style from "./layout.module.scss";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Layout({ children }: LayoutProps): JSX.Element {
	return <article className={style["content"]}>{children}</article>;
}

export const metadata: Metadata = {
	title: { default: "Article", template: "%s | Blog | Lakuna" }
};
