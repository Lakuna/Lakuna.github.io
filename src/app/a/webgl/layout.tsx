import "styles/highlight.scss";
import "styles/katex.scss";
import type LayoutProps from "types/LayoutProps";

export default function Layout({ children }: LayoutProps) {
	return children;
}

export const metadata = {
	title: {
		default: "Article",
		template: "%s | WebGL Tutorial | Lakuna"
	}
};
