"use client";

import type { UglCanvasProps } from "#/app/a/webgl/UglCanvasProps.js";
import type { JSX } from "react/jsx-runtime";

import ReactCanvas from "@lakuna/react-canvas";
import {
	Context,
	ElementBuffer,
	Program,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";

const vss = `\
#version 300 es

in vec4 position;

uniform vec4 scaling;

void main() {
	gl_Position = position * scaling;
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

const positionData = new Float32Array([
	// Point 0 at (-0.2, 0.2)
	-0.2, 0.2,

	// Point 1 at (-0.2, -0.2)
	-0.2, -0.2,

	// Point 2 at (0.2, -0.2)
	0.2, -0.2,

	// Point 3 at (0.2, 0.2)
	0.2, 0.2
]);

const indexData = new Uint8Array([
	// Triangle 0
	0, 1, 2,

	// Triangle 1
	0, 2, 3
]);

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function Scaling(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const rectVao = new VertexArray(
					program,
					{ position: { size: 2, vbo: positionBuffer } },
					indexBuffer
				);

				return (now) => {
					gl.resize();
					gl.fbo.clear();
					const scale = 2 + Math.cos(now * 0.001);
					gl.fbo.draw(rectVao, { scaling: [scale, scale, 1, 1] });
				};
			}}
			{...props}
		/>
	);
}
