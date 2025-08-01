"use client";

import {
	BlendFunction,
	BufferUsage,
	Context,
	ElementBuffer,
	Program,
	type Rectangle,
	Texture2d,
	TextureFilter,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	type Matrix4Like,
	createMatrix4Like,
	identity,
	invert,
	multiply,
	perspective,
	rotateY,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";
import domain from "util/domain";

const vss = `\
#version 300 es

in vec4 position;
in vec2 texcoord;

uniform mat4 worldViewProj;

out vec2 vTexcoord;

void main() {
	gl_Position = worldViewProj * position;
	vTexcoord = texcoord;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 vTexcoord;

uniform sampler2D tex;

out vec4 outColor;

void main() {
	outColor = texture(tex, vTexcoord);
}
`;

const quadPosData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const quadTexcoordData = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);
const quadIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

const defaultGlyphs = new Map<string, Rectangle & number[]>([
	["A", [0, 0, 8, 8]],
	["B", [8, 0, 8, 8]],
	["C", [16, 0, 8, 8]],
	["D", [24, 0, 8, 8]],
	["E", [32, 0, 8, 8]],
	["F", [40, 0, 8, 8]],
	["G", [48, 0, 8, 8]],
	["H", [56, 0, 8, 8]],
	["I", [0, 8, 8, 8]],
	["J", [8, 8, 8, 8]],
	["K", [16, 8, 8, 8]],
	["L", [24, 8, 8, 8]],
	["M", [32, 8, 8, 8]],
	["N", [40, 8, 8, 8]],
	["O", [48, 8, 8, 8]],
	["P", [56, 8, 8, 8]],
	["Q", [0, 16, 8, 8]],
	["R", [8, 16, 8, 8]],
	["S", [16, 16, 8, 8]],
	["T", [24, 16, 8, 8]],
	["U", [32, 16, 8, 8]],
	["V", [40, 16, 8, 8]],
	["W", [48, 16, 8, 8]],
	["X", [56, 16, 8, 8]],
	["Y", [0, 24, 8, 8]],
	["Z", [8, 24, 8, 8]],
	["0", [16, 24, 8, 8]],
	["1", [24, 24, 8, 8]],
	["2", [32, 24, 8, 8]],
	["3", [40, 24, 8, 8]],
	["4", [48, 24, 8, 8]],
	["5", [56, 24, 8, 8]],
	["6", [0, 32, 8, 8]],
	["7", [8, 32, 8, 8]],
	["8", [16, 32, 8, 8]],
	["9", [24, 32, 8, 8]],
	["-", [32, 32, 8, 8]],
	["×", [40, 32, 8, 8]],
	["!", [48, 32, 8, 8]],
	["©", [56, 32, 8, 8]],
	[" ", [0, 0, 8, 0]] // Just make spaces have no height since they aren't on the bitmap font.
]);

/**
 * A quad that displays text.
 * @public
 */
class TextQuad {
	/**
	 * Create a text quad.
	 * @param texture - The glyph texture (texture atlas) to use with the text quad.
	 * @param glyphs - The glyph map that corresponds to the glyph texture.
	 */
	public constructor(
		texture: Texture2d,
		glyphs: Map<string, Rectangle & number[]>
	) {
		this.texture = texture;
		this.glyphs = glyphs;
		this.context = this.texture.context;
		this.widthCache = 0;
		this.heightCache = 0;
		this.textCache = "";
		this.lettersToRender = this.textCache.length;
		this.program = Program.fromSource(this.context, vss, fss);
		this.posBuffer = new VertexBuffer(
			this.context,
			new Float32Array(),
			BufferUsage.DYNAMIC_DRAW
		);
		this.texcoordBuffer = new VertexBuffer(
			this.context,
			new Float32Array(),
			BufferUsage.DYNAMIC_DRAW
		);
		this.ebo = new ElementBuffer(
			this.context,
			new Uint32Array(),
			BufferUsage.DYNAMIC_READ
		);
		this.vao = new VertexArray(
			this.program,
			{
				position: { size: 2, vbo: this.posBuffer },
				texcoord: { size: 2, vbo: this.texcoordBuffer }
			},
			this.ebo
		);
	}

	/**
	 * The rendering context of the text quad.
	 * @internal
	 */
	private readonly context;

	/**
	 * The glyph texture (texture atlas) to use with the text quad.
	 * @internal
	 */
	private readonly texture;

	/**
	 * The glyph map that corresponds to the glyph texture.
	 * @internal
	 */
	private readonly glyphs;

	/**
	 * The position data buffer.
	 * @internal
	 */
	private readonly posBuffer;

	/**
	 * The texture coordinate data buffer.
	 * @internal
	 */
	private readonly texcoordBuffer;

	/**
	 * The element buffer object (indices).
	 * @internal
	 */
	private readonly ebo;

	/**
	 * The shader program to use for rendering this text quad.
	 * @internal
	 */
	private readonly program;

	/**
	 * The vertex array object of this text quad.
	 * @internal
	 */
	private readonly vao;

	/**
	 * The number of letters to render on this text quad.
	 * @internal
	 */
	private lettersToRender;

	/**
	 * The width of the text on this quad.
	 * @internal
	 */
	private widthCache;

	/** The width of the text on this quad. */
	public get width() {
		return this.widthCache;
	}

	/**
	 * The height of the text on this quad.
	 * @internal
	 */
	private heightCache;

	/** The height of the text on this quad. */
	public get height() {
		return this.heightCache;
	}

	/**
	 * Change the maximum length of the string that this text quad can display.
	 * @param length - The length of the string to display in characters.
	 * @throws `Error` if this vertex array's element buffer or either of this vertex array's expected vertex buffers is not defined.
	 * @returns The arrays to fill with indices, positions, and texture coordinates, respectively.
	 * @internal
	 */
	private resize(length: number): [Uint32Array, Float32Array, Float32Array] {
		const currentLength = this.ebo.data.byteLength / 4 / 6; // `Uint32Array` has 4 bytes per element. Letters each require 6 indices.
		if (currentLength < length) {
			// Current arrays are not large enough; return new ones.

			// Each letter requires 4 vertices.
			const vertexCount = length * 4;

			// Each letter requires 6 indices. Each vertex requires 2 positions and 2 texture coordinates.
			return [
				new Uint32Array(length * 6),
				new Float32Array(vertexCount * 2),
				new Float32Array(vertexCount * 2)
			];
		}

		return [
			this.ebo.data as Uint32Array,
			this.posBuffer.data as Float32Array,
			this.texcoordBuffer.data as Float32Array
		];
	}

	/**
	 * The string displayed by this text quad.
	 * @internal
	 */
	private textCache;

	/** The string displayed by this text quad. */
	public get text(): string {
		return this.textCache;
	}

	public set text(value: string) {
		// Skip if the text is already correct.
		if (value === this.text) {
			return;
		}

		// Count the number of actual displayable characters in the string.
		let length = 0;
		for (const c of value) {
			if (this.glyphs.has(c)) {
				length++;
			}
		}

		// Get buffer data, resizing buffers if necessary.
		const [indexData, posData, texData] = this.resize(length);

		// Fill buffers.
		let x = 0;
		let y = 0;
		let currentLineHeight = 0;
		let width = 0; // The maximum width of the texture.
		let j = 0; // Only increments for visible glyphs.
		for (const c of value) {
			// Skip if there is no character.
			if (!c) {
				continue;
			}

			// Get the character's glyph.
			const glyph = this.glyphs.get(c);

			// Skip unknown characters.
			if (!glyph && c !== "\n") {
				continue;
			}

			// Add the character's glyph to the data. This configuration allows for visible newline characters.
			if (glyph) {
				const [u, v, w, h] = glyph;

				// Positions.
				posData[j * 4 * 2 + 0] = x;
				posData[j * 4 * 2 + 1] = y + h;
				posData[j * 4 * 2 + 2] = x;
				posData[j * 4 * 2 + 3] = y;
				posData[j * 4 * 2 + 4] = x + w;
				posData[j * 4 * 2 + 5] = y;
				posData[j * 4 * 2 + 6] = x + w;
				posData[j * 4 * 2 + 7] = y + h;

				// Texture coordinates.
				texData[j * 4 * 2 + 0] = u;
				texData[j * 4 * 2 + 1] = v;
				texData[j * 4 * 2 + 2] = u;
				texData[j * 4 * 2 + 3] = v + h;
				texData[j * 4 * 2 + 4] = u + w;
				texData[j * 4 * 2 + 5] = v + h;
				texData[j * 4 * 2 + 6] = u + w;
				texData[j * 4 * 2 + 7] = v;

				// Indices.
				indexData[j * 6 + 0] = j * 4 + 0;
				indexData[j * 6 + 1] = j * 4 + 1;
				indexData[j * 6 + 2] = j * 4 + 2;
				indexData[j * 6 + 3] = j * 4 + 0;
				indexData[j * 6 + 4] = j * 4 + 2;
				indexData[j * 6 + 5] = j * 4 + 3;

				// Update cursor.
				j++;
				x += w;
				if (h > currentLineHeight) {
					currentLineHeight = h;
				}
			}

			// If the character is a newline, go to the next line.
			if (c === "\n") {
				width = Math.max(width, x);
				x = 0;
				y -= currentLineHeight;
				currentLineHeight = 0;
			}
		}

		width = Math.max(width, x);
		const height = Math.abs(y - currentLineHeight);

		// Scale data.
		for (let i = 0; i < j * 4 * 2; i += 2) {
			// Scale down so that texture coordinates are represented in texture space.
			const u = texData[i + 0];
			if (u) {
				texData[i + 0] = u / this.texture.width;
			}

			const v = texData[i + 1];
			if (v) {
				texData[i + 1] = v / this.texture.height;
			}
		}

		// Update the buffer data on the GPU.
		this.posBuffer.data = posData;
		this.texcoordBuffer.data = texData;
		this.ebo.data = indexData;

		// Update dimension information.
		this.widthCache = width;
		this.heightCache = height;
		this.textCache = value;
		this.lettersToRender = j;
	}

	/**
	 * Render this text quad.
	 * @param worldViewProj - The world view projection matrix to render with.
	 */
	public render(worldViewProj: Matrix4Like & Float32Array) {
		this.context.fbo.draw(
			this.vao,
			{ tex: this.texture, worldViewProj },
			void 0,
			void 0,
			this.lettersToRender * 6
		);
	}
}

export default function GlyphTextures(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const quadPosBuffer = new VertexBuffer(gl, quadPosData);
				const quadTexcoordBuffer = new VertexBuffer(gl, quadTexcoordData);
				const quadIndexBuffer = new ElementBuffer(gl, quadIndexData);

				const quadVao = new VertexArray(
					program,
					{
						position: { size: 2, vbo: quadPosBuffer },
						texcoord: { size: 2, vbo: quadTexcoordBuffer }
					},
					quadIndexBuffer
				);

				const tex = Texture2d.fromImageUrl(
					gl,
					new URL("/images/webgl-example-texture.png", domain).href
				);

				// Public domain texture originally from https://opengameart.org/content/8x8-font-chomps-wacky-worlds-beta.
				const glyphTexture = Texture2d.fromImageUrl(
					gl,
					new URL("/images/webgl-example-glyph-texture.png", domain).href
				);
				glyphTexture.minFilter = TextureFilter.NEAREST;
				glyphTexture.magFilter = TextureFilter.NEAREST;

				const textQuad = new TextQuad(glyphTexture, defaultGlyphs);

				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();
				const viewProj = createMatrix4Like();
				const quad = createMatrix4Like();
				const text = createMatrix4Like();
				identity(cam);
				translate(cam, [0, 0, 5], cam);
				invert(cam, view);

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.doBlend = true;
					gl.blendFunction = [
						BlendFunction.SRC_ALPHA,
						BlendFunction.ONE_MINUS_SRC_ALPHA
					];
					gl.fbo.clear();

					// Update text.
					textQuad.text = Math.floor(now).toString();

					// Update matrices.
					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, proj);
					multiply(proj, view, viewProj);
					identity(quad);
					multiply(viewProj, quad, quad);
					identity(text);
					rotateY(text, now * 0.001, text);
					translate(text, [0, 0, 3], text);
					rotateY(text, now * -0.001, text);
					scale(text, [1 / 40, 1 / 40, 0], text);
					translate(text, [-textQuad.width / 2, 0, 1], text);
					multiply(viewProj, text, text);

					gl.fbo.draw(quadVao, { tex, worldViewProj: quad });

					textQuad.render(text);
				};
			}}
			{...props}
		/>
	);
}
