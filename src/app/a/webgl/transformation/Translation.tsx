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

in vec4 a_position;

uniform vec4 u_translation;

out vec4 v_color;

void main() {
	gl_Position = a_position + u_translation;
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

export default function Translation(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const rectVao = new VertexArray(
					program,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: positionBuffer } },
					indexBuffer
				);

				return (now) => {
					gl.resize();
					gl.clear();
					rectVao.draw({
						// eslint-disable-next-line camelcase
						u_translation: [0.8 * Math.cos(now * 0.001), 0, 0, 0]
					});
				};
			}}
			{...props}
		/>
	);
}
