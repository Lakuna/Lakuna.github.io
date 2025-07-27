"use client";

import {
	Context,
	ElementBuffer,
	Program,
	Texture2d,
	TextureFilter,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	identity,
	invert,
	multiply,
	perspective,
	rotateX,
	rotateY,
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

uniform mat4 matrix;

out vec2 vTexcoord;

void main() {
	gl_Position = matrix * position;
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

const positionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);

const texcoordData = new Float32Array([
	0, 0, 0, 0.5, 0.333, 0.5, 0.333, 0, 0.333, 0, 0.333, 0.5, 0.666, 0.5, 0.666,
	0, 0.666, 0, 0.666, 0.5, 1, 0.5, 1, 0, 0, 0.5, 0, 1, 0.333, 1, 0.333, 0.5,
	0.333, 0.5, 0.333, 1, 0.666, 1, 0.666, 0.5, 0.666, 0.5, 0.666, 1, 1, 1, 1, 0.5
]);

const indexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);

export default function TextureAtlases(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const texcoordBuffer = new VertexBuffer(gl, texcoordData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const cubeVao = new VertexArray(
					program,
					{
						position: positionBuffer,
						texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const tex = Texture2d.fromImageUrl(
					gl,
					new URL("/images/webgl-example-texture-atlas.png", domain).href
				);
				tex.minFilter = TextureFilter.NEAREST;
				tex.magFilter = TextureFilter.NEAREST;

				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();
				const viewProj = createMatrix4Like();
				const matrix = createMatrix4Like();
				identity(cam);
				translate(cam, [0, 0, 5], cam);
				invert(cam, view);

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, proj);
					multiply(proj, view, viewProj);
					identity(matrix);
					rotateX(matrix, now * 0.0005, matrix);
					rotateY(matrix, now * 0.001, matrix);
					multiply(viewProj, matrix, matrix);

					gl.fbo.draw(cubeVao, { matrix, tex });
				};
			}}
			{...props}
		/>
	);
}
