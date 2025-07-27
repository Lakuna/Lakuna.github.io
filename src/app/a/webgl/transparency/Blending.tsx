"use client";

import {
	BlendFunction,
	Context,
	Program,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	perspective,
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
	200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120,
	0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70,
	120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200,
	70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80,
	200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80,
	70, 200, 210, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80, 200, 200, 70,
	0x80, 200, 200, 70, 0x80, 200, 200, 70, 0x80, 200, 200, 70, 0x80, 200, 200,
	70, 0x80, 200, 200, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80, 210,
	100, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80,
	210, 160, 70, 0x80, 210, 160, 70, 0x80, 210, 160, 70, 0x80, 210, 160, 70,
	0x80, 210, 160, 70, 0x80, 210, 160, 70, 0x80, 70, 180, 210, 0x80, 70, 180,
	210, 0x80, 70, 180, 210, 0x80, 70, 180, 210, 0x80, 70, 180, 210, 0x80, 70,
	180, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80,
	100, 70, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80, 76, 210, 100,
	0x80, 76, 210, 100, 0x80, 76, 210, 100, 0x80, 76, 210, 100, 0x80, 76, 210,
	100, 0x80, 76, 210, 100, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 140,
	210, 80, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 90,
	130, 110, 0x80, 90, 130, 110, 0x80, 90, 130, 110, 0x80, 90, 130, 110, 0x80,
	90, 130, 110, 0x80, 90, 130, 110, 0x80, 160, 160, 220, 0x80, 160, 160, 220,
	0x80, 160, 160, 220, 0x80, 160, 160, 220, 0x80, 160, 160, 220, 0x80, 160, 160,
	220, 0x80
]);

export default function Blending(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const colorBuffer = new VertexBuffer(gl, colorData);

				const fVao = new VertexArray(program, {
					color: { normalized: true, size: 4, vbo: colorBuffer },
					position: positionBuffer
				});

				const world = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.doDepthTest = true;
					gl.depthMask = false;
					gl.doBlend = true;
					gl.blendFunction = [
						BlendFunction.SRC_ALPHA,
						BlendFunction.ONE_MINUS_SRC_ALPHA
					];
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 1000, world);
					translate(world, [0, 0, -500], world);
					rotateZ(world, now * 0.001, world);
					rotateX(world, now * 0.0007, world);

					gl.fbo.draw(fVao, { world });
				};
			}}
			{...props}
		/>
	);
}
