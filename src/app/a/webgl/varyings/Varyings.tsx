"use client";

import {
	Context,
	ElementBuffer,
	Program,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec4 color;

out vec4 vColor;

void main() {
	gl_Position = position;
	vColor = color;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec4 vColor;

out vec4 outColor;

void main() {
	outColor = vColor;
}
`;

const positionData = new Float32Array([
	// Point 0 at (0, 0.5)
	0, 0.5,

	// Point 1 at (0, 0)
	0, 0,

	// Point 2 at (0.7, 0)
	0.7, 0,

	// Point 3 at (0.7, 0.5)
	0.7, 0.5
]);

const colorData = new Float32Array([
	// Point 0 (red)
	1, 0, 0,

	// Point 1 (green)
	0, 1, 0,

	// Point 2 (blue)
	0, 0, 1,

	// Point 3 (magenta)
	1, 0, 1
]);

const indexData = new Uint8Array([
	// Triangle 0
	0, 1, 2,

	// Triangle 1
	0, 2, 3
]);

export default function Indices(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const colorBuffer = new VertexBuffer(gl, colorData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const rectVao = new VertexArray(
					program,
					{ color: colorBuffer, position: { size: 2, vbo: positionBuffer } },
					indexBuffer
				);

				return () => {
					gl.resize();
					gl.fbo.clear();
					gl.fbo.draw(rectVao);
				};
			}}
			{...props}
		/>
	);
}
