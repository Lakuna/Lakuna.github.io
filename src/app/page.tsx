import { BsGithub, BsLinkedin, BsTwitch } from "react-icons/bs";
import Link from "components/Link";
import type { Metadata } from "next";
import OneLiner from "./OneLiner";
import { Suspense } from "react";
import TwitchStreamIfLive from "components/TwitchStreamIfLive";
import style from "./page.module.scss";

export default function Page() {
	return (
		<div className={style["content"]}>
			<h1>{"Travis Martin"}</h1>
			<OneLiner />
			<hr />
			<Suspense>
				<TwitchStreamIfLive userId="262884468" muted />
			</Suspense>
			<ul className={style["socials"]}>
				<Link href="https://github.com/Lakuna">
					<BsGithub />
					{"GitHub"}
				</Link>
				<Link href="https://www.linkedin.com/in/t-j-m/">
					<BsLinkedin />
					{"LinkedIn"}
				</Link>
				<Link href="https://www.twitch.tv/lakuna0">
					<BsTwitch />
					{"Twitch"}
				</Link>
			</ul>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Travis Martin's website.",
	openGraph: { url: "/" },
	title: "Lakuna"
};
