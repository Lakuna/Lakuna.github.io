"use client";

import { Context, Program, VertexArray, VertexBuffer } from "@lakuna/ugl";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;

void main() {
	gl_Position = a_position;
}
`;

const fss = `\
#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
	outColor = vec4(0.5, 0.5, 0.5, 1);
}
`;

const positionData = new Float32Array([0, 0.5, 0, 0, 0.7, 0]);

export default function Attributes(props: JSX.IntrinsicElements["canvas"]) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);

				const rectVao = new VertexArray(
					program,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: positionBuffer } }
				);

				return () => {
					gl.resize();
					gl.clear();
					rectVao.draw();
				};
			}}
			{...props}
		/>
	);
}
