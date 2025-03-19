import Card from "components/Card";
import CardList from "components/CardList";
import DualDepthPeeling from "app/a/webgl/transparency/DualDepthPeeling";
import Fog from "app/a/webgl/fog/Fog";
import Framebuffers from "app/a/webgl/framebuffers/Framebuffers";
import GlyphTextures from "app/a/webgl/text/GlyphTextures";
import Image from "components/Image";
import Indices from "app/a/webgl/attributes/Indices";
import Matrices from "app/a/webgl/transformation/Matrices";
import type { Metadata } from "next";
import PercentageCloserFiltering from "app/a/webgl/shadows/PercentageCloserFiltering";
import Perspective from "app/a/webgl/3d/Perspective";
import PhongLighting from "app/a/webgl/lighting/PhongLighting";
import SceneGraph from "app/a/webgl/scene-graph/SceneGraph";
import Skyboxes from "app/a/webgl/cubemaps/Skyboxes";
import TextureAtlases from "app/a/webgl/textures/TextureAtlases";
import Uniforms from "app/a/webgl/uniforms/Uniforms";
import Varyings from "app/a/webgl/varyings/Varyings";
import contourDetection from "app/a/cccv/opengraph-image.png";
import style from "./page.module.scss";
import victoryScreen from "app/a/pedit5/opengraph-image.png";

export default function Page() {
	return (
		<div className={style["content"]}>
			<h1>{"Blog"}</h1>
			<hr />
			<CardList>
				<Card href="/a/cccv">
					<h2>{"Crash Course: Computer Vision"}</h2>
					<p>
						{
							"The companion article for my presentation about computer vision and Lunabotics."
						}
					</p>
					<p>
						{
							"Includes an overview of common computer vision tasks such as scene reconstruction, object recognition, and pose estimation, an overview of the NASA Lunabotics competition, and a crash course in basic Python programming."
						}
					</p>
					<Image
						src={contourDetection}
						alt="An example of contour detection."
					/>
				</Card>
				<Card href="/a/pedit5">
					<h2>
						<code>{"pedit5"}</code>
					</h2>
					<p>{"A guide to beating the world's first CRPG."}</p>
					<Image
						src={victoryScreen}
						alt="The victory cutscene in The Dungeon."
					/>
				</Card>
				<Card href="/a/q_rsqrt">
					<h2>{"Fast Inverse Square Root"}</h2>
					<p>
						{
							"An analysis of the famous fast multiplicative inverse square root algorithm as it is implemented in Quake III Arena, as well as the mathematics behind how it works (IEEE 754, bit manipulation, and Newton's method)."
						}
					</p>
				</Card>
				<Card href="/a/esojs">
					<h2>{"Esoteric JavaScript"}</h2>
					<p>
						{
							"A guide on how to write any JavaScript program with just six unique characters by abusing implicit type coercion and bracket notation."
						}
					</p>
				</Card>
				<Card href="/a/webgl">
					<h2>{"WebGL2 Tutorial"}</h2>
					<p>
						{
							"The table of contents for my WebGL2 tutorial series. Also contains a link to the glossary for the tutorial series."
						}
					</p>
				</Card>
				<Card href="/a/webgl/text">
					<h2>{"WebGL2 Text"}</h2>
					<GlyphTextures />
					<p>
						{
							"An introduction to rendering text in WebGL, including a guide for rendering bitmap fonts with glyph textures."
						}
					</p>
				</Card>
				<Card href="/a/webgl/transparency">
					<h2>{"WebGL2 Transparency"}</h2>
					<DualDepthPeeling />
					<p>
						{
							"An introduction to transparency in WebGL. Covers blending (functions and equations), alpha premultiplication, order-independent transparency (OIT), and includes a guide for dual depth peeling."
						}
					</p>
				</Card>
				<Card href="/a/webgl/fog">
					<h2>{"WebGL2 Fog"}</h2>
					<Fog />
					<p>
						{
							"An introduction to some techniques that are used to emulate distance fog (depth fog) in WebGL."
						}
					</p>
				</Card>
				<Card href="/a/webgl/shadows">
					<h2>{"WebGL2 Shadows"}</h2>
					<PercentageCloserFiltering />
					<p>
						{
							"An introduction to some techniques that are used to emulate shadows in WebGL. Covers shadow maps, shadow acne, Peter Panning, and percentage-closer filtering (PCF)."
						}
					</p>
				</Card>
				<Card href="/a/webgl/cubemaps">
					<h2>{"WebGL2 Cubemaps"}</h2>
					<Skyboxes />
					<p>
						{
							"An introduction to cubemaps in WebGL. Covers some of their most common uses, such as environment maps and skyboxes."
						}
					</p>
				</Card>
				<Card href="/a/webgl/lighting">
					<h2>{"WebGL2 Lighting"}</h2>
					<PhongLighting />
					<p>
						{
							"An introduction to some techniques that are used to emulate lighting in WebGL. Covers normals, diffuse, ambient, point, specular, and spot lighting, and the Phong and Blinn-Phong lighting models."
						}
					</p>
				</Card>
				<Card href="/a/webgl/framebuffers">
					<h2>{"WebGL2 Framebuffers"}</h2>
					<Framebuffers />
					<p>
						{
							"An introduction to framebuffers in WebGL. Also covers renderbuffers, attachments, and rendering to textures."
						}
					</p>
				</Card>
				<Card href="/a/webgl/textures">
					<h2>{"WebGL2 Textures"}</h2>
					<TextureAtlases />
					<p>
						{
							"An introduction to textures in WebGL, including texture atlases, data textures, sampling, and projection mapping."
						}
					</p>
				</Card>
				<Card href="/a/webgl/3d">
					<h2>{"WebGL2 3D"}</h2>
					<Perspective />
					<p>
						{
							"An introduction to depth and the techniques that are used to render 3D scenes in WebGL. Covers depth testing, polygon culling, orthographic and perspective projections, cameras, and view matrices."
						}
					</p>
				</Card>
				<Card href="/a/webgl/scene-graph">
					<h2>{"WebGL2 Scene Graphs"}</h2>
					<SceneGraph />
					<p>
						{
							"An introduction to the scene graph data structure as it relates to OpenGL."
						}
					</p>
				</Card>
				<Card href="/a/webgl/transformation">
					<h2>{"WebGL2 Transformation"}</h2>
					<Matrices />
					<p>
						{
							"An introduction to transformation in WebGL, including translation, rotation, scaling, orthographic projection, and the linear algebra necessary to perform transformations with matrices."
						}
					</p>
				</Card>
				<Card href="/a/webgl/varyings">
					<h2>{"WebGL2 Varyings"}</h2>
					<Varyings />
					<p>{"An introduction to varyings in WebGL."}</p>
				</Card>
				<Card href="/a/webgl/uniforms">
					<h2>{"WebGL2 Uniforms"}</h2>
					<Uniforms />
					<p>{"An introduction to uniforms in WebGL."}</p>
				</Card>
				<Card href="/a/webgl/attributes">
					<h2>{"WebGL2 Attributes"}</h2>
					<Indices />
					<p>
						{
							"An introduction to attributes, buffers, and vertex array objects in WebGL. Also covers locations and binding points."
						}
					</p>
				</Card>
				<Card href="/a/webgl/program-structure">
					<h2>{"WebGL2 Program Structure"}</h2>
					<p>
						{
							"A reference page for the typical structure of a program that uses OpenGL."
						}
					</p>
				</Card>
				<Card href="/a/webgl/shaders">
					<h2>{"WebGL2 Shaders"}</h2>
					<p>
						{
							"An introduction to shaders (vertex and fragment), shader programs, rasterization, and GLSL."
						}
					</p>
				</Card>
				<Card href="/a/webgl/intro">
					<h2>{"WebGL2 Introduction"}</h2>
					<p>{"The introduction to my WebGL2 tutorial series."}</p>
				</Card>
				<Card href="/a/mtg">
					<h2>{"Magic: The Gathering Deck Building Compendium"}</h2>
					<p>
						{
							"A summary of my knowledge about deck building for Magic: The Gathering. Includes a built-in hypergeometric calculator."
						}
					</p>
				</Card>
			</CardList>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Travis Martin's blog.",
	openGraph: { url: "/blog" },
	title: "Blog"
};
