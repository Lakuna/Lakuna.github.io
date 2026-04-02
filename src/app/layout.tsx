import "@/styles/global.scss";
import type { Metadata, Viewport } from "next";
import type { JSX } from "react/jsx-runtime";

import type LayoutProps from "@/types/LayoutProps";

import domain from "@/util/domain";
import { monospace, sansSerif, serif } from "@/util/font";

import style from "./layout.module.scss";
import Topnav from "./Topnav";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Layout({ children }: LayoutProps): JSX.Element {
	return (
		<html
			className={`${serif.variable} ${sansSerif.variable} ${monospace.variable}`}
			lang="en-US"
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

export const viewport: Viewport = {
	colorScheme: "dark light",
	themeColor: "#50c878"
};

export const metadata: Metadata = {
	authors: [{ name: "Travis Martin", url: new URL(domain) }],
	creator: "Travis Martin",
	metadataBase: new URL(domain),
	openGraph: { siteName: "Lakuna", type: "website" },
	publisher: "Travis Martin",
	title: { default: "Page", template: "%s | Lakuna" },
	twitter: { creatorId: "1117270419298496513", siteId: "1117270419298496513" }
};
