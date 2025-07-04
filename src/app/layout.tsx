import "styles/global.scss";
import type { Metadata, Viewport } from "next";
import { monospace, sansSerif, serif } from "util/font";
import type { JSX } from "react";
import type LayoutProps from "types/LayoutProps";
import Topnav from "./Topnav";
import domain from "util/domain";
import style from "./layout.module.scss";

export default function Layout({ children }: LayoutProps): JSX.Element {
	return (
		<html
			lang="en-US"
			className={`${serif.variable} ${sansSerif.variable} ${monospace.variable}`}
		>
			<body className={style["spacer"]}>
				<header>
					<Topnav />
				</header>
				<main>{children}</main>
				<footer />
			</body>
		</html>
	);
}

export const viewport = {
	colorScheme: "dark light",
	themeColor: "#50c878"
} satisfies Viewport;

export const metadata = {
	authors: [{ name: "Travis Martin", url: new URL(domain) }],
	creator: "Travis Martin",
	metadataBase: new URL(domain),
	openGraph: {
		siteName: "Lakuna",
		type: "website"
	},
	publisher: "Travis Martin",
	title: {
		default: "Page",
		template: "%s | Lakuna"
	},
	twitter: {
		creatorId: "1117270419298496513",
		siteId: "1117270419298496513"
	}
} satisfies Metadata;
