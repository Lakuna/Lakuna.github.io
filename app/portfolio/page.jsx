import Link from "next/link";
import Image from "next/image";
import CardList from "../CardList";
import Card from "../Card";
import residuumPreview from "./residuum.png";
import statecraftPreview from "./statecraft.png";
import prepareModeratelyPreview from "./prepare-moderately.png";
import mobaPreview from "./moba.png";
import outpostPreview from "./outpost.png";
import Cameras from "../a/webgl/3d/Cameras";

export default function Page() {
	return (
		<>
			<h1>Portfolio</h1>
			<p>You can find more of my code on <Link href="https://github.com/Lakuna">my GitHub account</Link>.</p>
			<h2>Projects</h2>
			<CardList>
				<Card>
					<h3>Umbra</h3>
					<Cameras style={{ width: "100%" }} />
					<p>A lightweight visual application framework for WebGL2.</p>
					<p>Written in <strong>TypeScript</strong>.</p>
					<p>The source code is available on <Link href="https://github.com/Lakuna/Umbra">its GitHub repository</Link>, and the documentation is on <Link href="https://umbra.lakuna.pw/">its website</Link>.</p>
				</Card>
				<Card>
					<h3>My website</h3>
					<p>This website, which has gone through several iterations since it was first put online on <time>November 13, 2017</time>.</p>
					<p>Written in <strong>TypeScript</strong>, <strong>JSX</strong>, and <strong>Sass</strong> with <Link href={"https://nextjs.org/"}>Next.js</Link> and <Link href={"https://reactjs.org/"}>React</Link>.</p>
					<p>The source code is available on <Link href="https://github.com/Lakuna/Lakuna.github.io">its GitHub repository</Link>.</p>
				</Card>
				<Card>
					<h3>EPS</h3>
					<p>Change Healthcare{"'"}s <Link href="https://www.changehealthcare.com/pharmacy/management/enterprise-pharmacy-system">Enterprise Pharmacy System</Link>.</p>
					<p>I worked on EPS as part of my internship with PDX, Inc. I worked with a large team of developers and got my first experience with <strong>Jira</strong> and the <strong>Agile methodology</strong>. I participated in regular meetings and code reviews. All of my code was written in <strong>Java</strong>.</p>
				</Card>
				<Card>
					<h3>Residuum</h3>
					<Image src={residuumPreview} alt="Residuum preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
					<p>A cross-platform (desktop and mobile), augmented reality-optional real-time strategy game. Co-developed with <Link href="https://ty.business/portfolio/">Ty Morrow</Link> and <Link href="https://griff.pw/">Griffon Hanson</Link> at Edikt Studios.</p>
					<p>This project was my introduction to augmented reality, advanced pathfinding techniques, and data-oriented programming.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/">Unity</Link>.</p>
				</Card>
				<Card>
					<h3>Prepare Moderately</h3>
					<Image src={prepareModeratelyPreview} alt="Prepare Moderately preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
					<p>A mod for the real-time strategy game <Link href="https://rimworldgame.com/">RimWorld</Link>.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://github.com/pardeike/Harmony">Harmony</Link>.</p>
					<p>The source code is available on <Link href="https://github.com/Lakuna/RimWorld-Prepare-Moderately">its GitHub repository</Link>, and it can be downloaded from <Link href={"https://steamcommunity.com/sharedfiles/filedetails/?id=2057362949"}>its Steam Workshop page</Link>.</p>
				</Card>
				<Card>
					<h3>Statecraft</h3>
					<Image src={statecraftPreview} alt="Statecraft preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
					<p>A turn-based multiplayer historical strategy game. Developed at Edikt Studios.</p>
					<p>Features peer-to-peer connections and a procedurally-generated, serializable map.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/">Unity</Link>.</p>
				</Card>
				<Card>
					<h3>Untitled MOBA</h3>
					<Image src={mobaPreview} alt="Untitled MOBA preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
					<p>A multiplayer online battle arena game. Co-developed with Alex Ho and Fernando Rivera at Edikt Studios.</p>
					<p>Features a diagonally symmetrical map model generated by a <strong>Python</strong> script of my own design.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/">Unity</Link>.</p>
				</Card>
				<Card>
					<h3>Outpost</h3>
					<Image src={outpostPreview} alt="Outpost preview." style={{ width: "100%", height: "auto" }} placeholder="blur" />
					<p>A real-time strategy game based around automated pawns with a task queue.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/">Unity</Link>.</p>
				</Card>
				<Card>
					<h3>Diplomat</h3>
					<p>A console program that uses brute force to determine the best move in a game of <Link href="https://en.wikipedia.org/wiki/Diplomacy_(game)">Diplomacy</Link>.</p>
					<p>The source code is available on <Link href={`https://github.com/Lakuna/Diplomat`}>its GitHub repository</Link>.</p>
				</Card>
			</CardList>
		</>
	);
}