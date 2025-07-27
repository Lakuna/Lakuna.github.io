"use client";

import { Context, Program, VertexArray, VertexBuffer } from "@lakuna/ugl";
import {
	createMatrix4Like,
	ortho,
	rotateX,
	rotateZ,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec4 color;

uniform mat4 world;

out vec4 vColor;

void main() {
	gl_Position = world * position;
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
	0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0, 30, 0, 0, 30,
	30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0, 30, 60, 0, 30, 90, 0, 67,
	60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0, 0, 0, 30, 30, 0, 30, 0, 150, 30, 0,
	150, 30, 30, 0, 30, 30, 150, 30, 30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30,
	30, 100, 0, 30, 100, 30, 30, 30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30,
	67, 60, 30, 67, 90, 30, 0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30,
	0, 0, 30, 100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0,
	30, 30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,
	30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30, 30, 60,
	0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30, 67, 60, 0, 67,
	90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30, 30, 90, 0, 30, 90, 30,
	67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0, 30, 90, 0, 30, 150, 30, 30, 90,
	30, 30, 90, 0, 30, 150, 0, 30, 150, 30, 0, 150, 0, 0, 150, 30, 30, 150, 30, 0,
	150, 0, 30, 150, 30, 30, 150, 0, 0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0,
	150, 30, 0, 150, 0
]);

const colorData = new Uint8Array([
	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
	120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
	120, 200, 70, 120, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70,
	200, 210, 70, 200, 210, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200,
	70, 200, 200, 70, 200, 200, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
	100, 70, 210, 100, 70, 210, 100, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70,
	210, 160, 70, 210, 160, 70, 210, 160, 70, 70, 180, 210, 70, 180, 210, 70, 180,
	210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 100, 70, 210, 100, 70, 210,
	100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 76, 210, 100, 76, 210,
	100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 140, 210, 80,
	140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 90, 130,
	110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110,
	160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
	160, 160, 220
]);

export default function Orthographic(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const colorBuffer = new VertexBuffer(gl, colorData);

				const fVao = new VertexArray(program, {
					color: { normalized: true, vbo: colorBuffer },
					position: positionBuffer
				});

				const world = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					ortho(0, w, 0, h, 0, 1000, world);
					translate(world, [w / 2, h / 2, -500], world);
					rotateZ(world, now * 0.001, world);
					rotateX(world, now * 0.0007, world);

					gl.fbo.draw(fVao, { world });
				};
			}}
			{...props}
		/>
	);
}
