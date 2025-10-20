import type { JSX } from "react";
import type LayoutProps from "types/LayoutProps";
import type { Metadata } from "next";
import style from "./layout.module.scss";

export default function Layout({ children }: LayoutProps): JSX.Element {
	return <article className={style["content"]}>{children}</article>;
}

export const metadata = {
	title: { default: "Article", template: "%s | Blog | Lakuna" }
} satisfies Metadata;
