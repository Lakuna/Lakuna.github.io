"use client";

import {
	Context,
	ElementBuffer,
	Program,
	Texture2d,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import { createMatrix4Like, identity, scale } from "@lakuna/umath/Matrix4";
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

const positionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);

const texcoordData = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);

const indexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function Textures(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const texcoordBuffer = new VertexBuffer(gl, texcoordData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const quadVao = new VertexArray(
					program,
					{
						position: { size: 2, vbo: positionBuffer },
						texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const tex = Texture2d.fromImageUrl(
					gl,
					new URL("/images/webgl-example-texture.png", domain).href
				);

				const matrix = createMatrix4Like();

				return () => {
					gl.resize();
					gl.fbo.clear();

					identity(matrix);
					const w = canvas.width;
					const h = canvas.height;
					scale(
						matrix,
						w > h ? [h / (w || 1), 1, 1] : [1, w / (h || 1), 1],
						matrix
					);

					gl.fbo.draw(quadVao, { matrix, tex });
				};
			}}
			{...props}
		/>
	);
}
