import Card from "components/Card";
import CardList from "components/CardList";
import Gcs from "./gcs.svg";
import Image from "components/Image";
import Link from "components/Link";
import type { Metadata } from "next";
import PhongLighting from "app/a/webgl/lighting/PhongLighting";
import YoutubeVideo from "components/YoutubeVideo";
import christmasHats from "./christmas-hats.png";
import cityViewer from "./city-viewer.gif";
import codehs from "./codehs.png";
import edikt from "./edikt.png";
import elytraTrinket from "./elytra-trinket.png";
import mmwd from "./mmwd.png";
import nitel from "./nitel.webp";
import pdx from "./pdx.jpg";
import poseidon from "./poseidon.jpg";
import prepareModerately from "./prepare-moderately.png";
import rayTracer from "./ray-tracer.png";
import riseOfCivilizations from "./rise-of-civilizations.png";
import style from "./page.module.scss";
import wellMet from "./well-met.png";

export default function Page() {
	return (
		<div className={style["content"]}>
			<h1>{"Portfolio"}</h1>
			<hr />
			<h2>{"Projects"}</h2>
			<CardList>
				<Card href="https://ugl.lakuna.pw/">
					<h3>{"μGL"}</h3>
					<PhongLighting />
					<p>
						{
							"A lightweight low-level WebGL2 library that includes a variety of classes that are useful for developing two- and three-dimensional games, animations, and simulations. Designed to simplify the developer experience while reducing unnecessary calls to the GPU."
						}
					</p>
					<ul>
						<li>{"Caches known GPU state on the CPU."}</li>
						<li>{"Automatically disregards redundant API calls."}</li>
						<li>{"Completely abstracts away binding points."}</li>
						<li>
							{
								"Provides sensible default parameters to simplify common operations."
							}
						</li>
						<li>{"Hides vestigial parameters."}</li>
						<li>
							{
								"Written in TypeScript with TSDoc comments that are used by TypeDoc to generate documentation."
							}
						</li>
					</ul>
				</Card>
				<Card href="https://umath.lakuna.pw/">
					<h3>{"μMath"}</h3>
					<p>
						{
							"A lightweight math library that includes a variety of common functions, especially concerning linear algebra transformations."
						}
					</p>
					<ul>
						<li>
							{
								"Includes a fast linear algebra API that is optimized for physics- and graphics-related operations."
							}
						</li>
						<li>
							{
								"Includes a slow linear algebra API that is optimized for developer experience and performing unlimited-dimensional operations."
							}
						</li>
						<li>
							{
								"Has a more intuitive interface and is faster than alternative libraries."
							}
						</li>
						<li>
							{
								"Written in TypeScript with TSDoc comments that are used by TypeDoc to generate documentation."
							}
						</li>
					</ul>
				</Card>
				<Card href="https://www.gcsleague.com/">
					<h3>{"Gauntlet Championship Series Website"}</h3>
					<Gcs className={style["half"]} />
					<p>
						{
							"The website for the Gauntlet Championship Series, which is a League of Legends draft league. Primary features include statistic collection, storage, and display, roster management tools, and match scheduling tools."
						}
					</p>
					<p>
						{
							"The website uses Next.js (React), a PostgreSQL database with Drizzle as an ORM, Sass modules for styling, and TypeScript."
						}
					</p>
				</Card>
				<Card>
					<h3>{"lakuna.pw"}</h3>
					<p>{"My personal website since November 13, 2017."}</p>
					<p>
						{
							"The website is written fully in TypeScript and uses Next.js (React) as its framework. Styling is done with Sass modules."
						}
					</p>
					<p>
						{
							"The website primarily features my portfolio (you are here) and blog."
						}
					</p>
					<p>
						{
							"Various (usually programming-related) blog posts can be found on "
						}
						<Link href="/blog">{"the blog page"}</Link>
						{"."}
					</p>
				</Card>
				<Card href="https://steamcommunity.com/sharedfiles/filedetails/?id=2057362949">
					<h3>{"Prepare Moderately"}</h3>
					<Image
						src={prepareModerately}
						alt="The Prepare Moderately preview image."
					/>
					<p>
						{
							"A RimWorld mod that allows players to re-roll pawns until they meet user-defined criteria. Written in C# with Harmony and fully backwards compatible since version 1.0."
						}
					</p>
					<Image
						alt="Prepare Moderately subscriber count."
						src="https://img.shields.io/steam/subscriptions/2057362949?style=for-the-badge"
						className={style["shield"]}
						untrusted
					/>
				</Card>
				<Card href="https://uscene.lakuna.pw/">
					<h3>{"μScene"}</h3>
					<p>
						{
							"A scene graph implementation using μMath and designed to be used with μGL. Includes utilities for sorting the objects in the scene in proper rendering order. Written in TypeScript with TSDoc comments that are used by TypeDoc to generate documentation."
						}
					</p>
				</Card>
				<Card href="https://color.lakuna.pw/">
					<h3>{"Color"}</h3>
					<p>{"A library for performing various color-related operations."}</p>
					<ul>
						<li>
							{
								"Color space conversion between most popular color spaces, including sRGB, CIE 1931 XYZ, CIELAB, CIELUV, and Oklab."
							}
						</li>
						<li>
							{
								"Name lookup in all of the most popular color name dictionaries."
							}
						</li>
						<li>
							{
								"Color comparison functions that are intended to be perceptually uniform, including CIEDE2000, CIE 1976, and ΔE* 1994."
							}
						</li>
						<li>{"Color blindness simulation."}</li>
						<li>
							{
								"Written in TypeScript with TSDoc comments that are used by TypeDoc to generate documentation."
							}
						</li>
					</ul>
				</Card>
				<Card href="https://react-canvas.lakuna.pw/">
					<h3>{"React Canvas"}</h3>
					<p>
						{
							"A React canvas element that supports a built-in animation. Designed for use with μGL or WebGL in general. Written in TypeScript with TSDoc comments that are used by TypeDoc to generate documentation."
						}
					</p>
				</Card>
				<Card>
					<h3>{"Poseidon"}</h3>
					<Image src={poseidon} alt="UIC's Poseidon rover." />
					<p>
						{"UIC's 2024 submission to NASA's "}
						<Link href="https://www.nasa.gov/learning-resources/lunabotics-challenge/">
							{"Lunabotics Challenge"}
						</Link>
						{
							", named for the Greek god of earthquakes due to its key unique feature: an industrial sand vibrator."
						}
					</p>
					<p>
						{
							"I joined the team after most of the initial design work had concluded in order to focus on automation. My primary contributions were to computer vision research, part selection, and "
						}
						<Link href="/a/cccv">{"the outreach portion"}</Link>
						{" of the competition."}
					</p>
					<p>
						{
							"The rover's code was written in Python with ROS 2 Humble Hawksbill."
						}
					</p>
					<p>
						{"You can find UIC's article about the rover "}
						<Link href="https://engineering.uic.edu/news-stories/uic-students-impress-judges-at-nasa-lunabotics-competition/">
							{"here"}
						</Link>
						{"."}
					</p>
				</Card>
				<Card href="https://modrinth.com/mod/elytra_trinket">
					<h3>{"Elytra Trinket"}</h3>
					<Image
						src={elytraTrinket}
						alt="A Minecraft character wearing an Elytra and a chestplate at the same time."
					/>
					<p>
						{
							"A Minecraft mod that allows players to equip Elytra at the same time as a chestplate. Written in Java with the Fabric mod loader and the Trinkets API."
						}
					</p>
				</Card>
				<Card>
					<h3>
						<code>{"pedit5"}</code>
						{" Auto Splitter"}
					</h3>
					<p>
						{"A "}
						<Link href="https://livesplit.org/">{"LiveSplit"}</Link>
						{
							" auto splitter for the world's first CRPG game, The Dungeon (better known by its filename "
						}
						<code>{"pedit5"}</code>
						{")."}
					</p>
					<p>
						{
							"Written in Auto Splitting Language. Cheat Engine was used to determine pointer paths to key values."
						}
					</p>
					<p>
						{"You can view the source code "}
						<Link href="https://github.com/Lakuna/TheDungeonAutoSplitter">
							{"here"}
						</Link>
						{"."}
					</p>
				</Card>
				<Card href="https://www.xanycki.art/">
					<h3>{"Xanycki's Portfolio"}</h3>
					<p>
						{
							"Xanycki's art portfolio, written in TypeScript with Next.js (React)."
						}
					</p>
				</Card>
				<Card href="https://steamcommunity.com/sharedfiles/filedetails/?id=2553173153">
					<h3>{"Well Met"}</h3>
					<Image src={wellMet} alt="The Well Met preview image." />
					<p>
						{
							"A RimWorld mod that hides pawns' traits until you get to know them. Written in C# and fully backwards compatible since version 1.0."
						}
					</p>
					<Image
						alt="Well Met subscriber count."
						src="https://img.shields.io/steam/subscriptions/2553173153?style=for-the-badge"
						className={style["shield"]}
						untrusted
					/>
				</Card>
				<Card href="https://steamcommunity.com/sharedfiles/filedetails/?id=1947309066">
					<h3>{"RimWorld Christmas Hats"}</h3>
					<Image src={christmasHats} alt="The Christmas Hats preview image." />
					<p>
						{
							"A version 1.x port of Drizzly's Christmas Hats mod for RimWorld. Written using only XML and fully backwards compatible since version 1.0."
						}
					</p>
					<Image
						alt="RimWorld Christmas Hats subscriber count."
						src="https://img.shields.io/steam/subscriptions/1947309066?style=for-the-badge"
						className={style["shield"]}
						untrusted
					/>
				</Card>
				<Card>
					<h3>{"Diplomat"}</h3>
					<p>
						{"A high school Python project that brute-forces games of "}
						<Link href="https://en.wikipedia.org/wiki/Diplomacy_(game)">
							{"Diplomacy"}
						</Link>
						{
							" to determine optimal moves. Designed to be extensively moddable, which allows it to be used to play games of Diplomacy with custom maps and rulesets."
						}
					</p>
					<p>
						{"You can view the source code "}
						<Link href="https://github.com/Lakuna/Diplomat">{"here"}</Link>
						{"."}
					</p>
				</Card>
			</CardList>
			<h2>{"Work Experience"}</h2>
			<CardList>
				<Card href="https://www.nitelusa.com/">
					<h3>{"Nitel"}</h3>
					<Image src={nitel} alt="Nitel logo." />
					<p>
						{
							"I work as a software engineer at Nitel, focusing primarily on developing integrations. This includes both internal-facing projects such as active directory synchronization and external-facing projects such as revamping the proactive alerts system to notify over 6,600 clients about network outages in real time."
						}
					</p>
					<p>
						{
							"Most of my projects were written in TypeScript, JavaScript, and C#, with some additional use of SQL, SOQL, and Apex. The primary methodology used by the development team was Scrum."
						}
					</p>
				</Card>
				<Card href="https://codehs.com/">
					<h3>{"CodeHS"}</h3>
					<Image src={codehs} alt="CodeHS logo." />
					<p>
						{
							"I worked as a software engineer intern at CodeHS where, among other things, I implemented the Scratch sandbox, which is used to start teaching elementary school-aged children how to code."
						}
					</p>
					<p>
						{
							"Other projects that I made significant contributions towards include the new sidebar, user settings page, course completion certificates, and various internal tools."
						}
					</p>
					<p>
						{
							"While working at CodeHS, I wrote most of my code in Python (Django), JavaScript, and TypeScript. The development team used the DevOps methodology and made frequent use of Extreme Programming practices such as pair programming."
						}
					</p>
				</Card>
				<Card>
					<h3>{"Edikt Studios"}</h3>
					<Image
						src={edikt}
						alt="Edikt Studios logo."
						className={style["half"]}
					/>
					<p>
						{
							"I worked as a software engineer intern at Edikt Studios, which is a video game development studio created by my high school teacher in order to give computer science students internship experience. During my time at Edikt, I made extensive use of the Scrum methodology and served as Scrum master on a variety of projects. Most projects were written in C# with Unity."
						}
					</p>
				</Card>
				<Card>
					<h3>{"PDX"}</h3>
					<Image src={pdx} alt="PDX logo." className={style["half"]} />
					<p>
						{
							"I worked as a software programmer intern at PDX, where my primary task was to fix user experience-related bugs in the Java Swing front end of the Enterprise Pharmacy System (EPS)."
						}
					</p>
				</Card>
			</CardList>
			<h2>{"School Projects"}</h2>
			<CardList>
				<Card>
					<h3>{"JavaScript Ray Tracer"}</h3>
					<Image src={rayTracer} alt="A ray traced scene." />
					<p>
						{
							"A simple ray tracer that uses the canvas 2D API to work in the browser. Written entirely in JavaScript."
						}
					</p>
				</Card>
				<Card>
					<h3>{"WebGL City Viewer"}</h3>
					<Image
						src={cityViewer}
						alt="A 3D model of part of the city of Chicago."
						placeholder="empty"
						unoptimized
					/>
					<p>
						{
							"A JavaScript program that can load map data to create a 3D model of a city. Includes simulated shadows via shadow mapping. Written in JavaScript and GLSL."
						}
					</p>
				</Card>
				<Card>
					<h3>{"Magic Missile Wizard Duel"}</h3>
					<Image
						src={mmwd}
						alt="A screenshot of Magic Missile Wizard Duel gameplay."
					/>
					<p>
						{
							"A physics-based multiplayer artillery game that is somewhat similar to a mix between Worms and Clash Royale. Written in TypeScript and GLSL."
						}
					</p>
				</Card>
				<Card>
					<h3>{"Rise of Civilizations"}</h3>
					<Image
						src={riseOfCivilizations}
						alt="A screenshot of Rise of Civilizations."
					/>
					<p>
						{
							"A stripped-down Civilization clone, developed in Unity with C#. Features a cellular automaton-based procedural map generator."
						}
					</p>
				</Card>
				<Card>
					<h3>{"Residuum"}</h3>
					<YoutubeVideo
						id="VGeUPhIjlzc"
						ccLoadPolicy={false}
						controls={false}
						disableKeyboard
						ivLoadPolicy={false}
						relYt
						mute
					/>
					<p>
						{
							"A combination factory management and tower defense game inspired by Factorio. The game can be played in augmented reality on tiles that can be placed in the real world or in a simulated environment on devices that don't support augmented reality. Developed in Unity with C#."
						}
					</p>
					<p>
						{"Developed in collaboration with "}
						<Link href="https://griff.pw/">{"Griffon Hanson"}</Link>
						{" and "}
						<Link href="https://ty.business/">{"Ty Morrow"}</Link>
						{"."}
					</p>
				</Card>
			</CardList>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Travis Martin's portfolio.",
	openGraph: { url: "/portfolio" },
	title: "Portfolio"
};
