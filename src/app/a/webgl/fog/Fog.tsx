"use client";

import { Context, Program, VertexArray, VertexBuffer } from "@lakuna/ugl";
import {
	type Matrix4Like,
	createMatrix4Like,
	fromTranslation,
	identity,
	invert,
	perspective,
	rotateX,
	rotateY,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec4 color;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 world;

out vec4 vColor;
out vec4 worldViewPos;

void main() {
	worldViewPos = view * world * position;
	gl_Position = proj * worldViewPos;
	vColor = color;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec4 vColor;
in vec4 worldViewPos;

uniform vec4 fogColor;
uniform float fogDensity;

out vec4 outColor;

void main() {
	float fogDepth = length(worldViewPos);
	float fogAmount = clamp(1.0 - exp2(-fogDensity * fogDensity * fogDepth * fogDepth * 1.442695), 0.0, 1.0);
	outColor = mix(vColor, fogColor, fogAmount);
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

export default function Fog(props: UglCanvasProps): JSX.Element {
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

				const matrices: (Float32Array & Matrix4Like)[] = [];
				for (let i = 0; i < 5; i++) {
					const r = (i * Math.PI * 2) / 5;
					const s = Math.sin(r);
					const c = Math.cos(r);
					matrices.push(
						fromTranslation([c * 200, 0, s * 200], createMatrix4Like())
					);
				}

				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 1000, proj);
					identity(cam);
					rotateY(cam, now * 0.001, cam);
					rotateX(cam, (Math.PI * 9) / 10, cam);
					translate(cam, [0, 0, 500], cam);
					invert(cam, view);

					for (const world of matrices) {
						gl.fbo.draw(fVao, {
							fogColor: [0, 0, 0, 0],
							fogDensity: 0.003,
							proj,
							view,
							world
						});
					}
				};
			}}
			{...props}
		/>
	);
}
