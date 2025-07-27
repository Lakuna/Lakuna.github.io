"use client";

import {
	Context,
	ElementBuffer,
	Primitive,
	Program,
	Texture2d,
	TextureFilter,
	TextureFormat,
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

uniform mat4 world;
uniform mat4 viewProj;
uniform mat4 texMat;

out vec2 vTexcoord;
out vec4 projTexcoord;

void main() {
	vec4 worldPos = world * position;
	gl_Position = viewProj * worldPos;
	vTexcoord = texcoord;
	projTexcoord = texMat * worldPos;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 vTexcoord;
in vec4 projTexcoord;

uniform vec4 color;
uniform sampler2D tex;
uniform sampler2D projTex;

out vec4 outColor;

void main() {
	vec2 projTexcoord = (projTexcoord.xyz / projTexcoord.w).xy;

	bool inProj = projTexcoord.x >= 0.0
		&& projTexcoord.x <= 1.0
		&& projTexcoord.y >= 0.0
		&& projTexcoord.y <= 1.0;
	
	vec4 projTexColor = texture(projTex, projTexcoord);
	vec4 texColor = texture(tex, vTexcoord) * color;
	outColor = inProj ? projTexColor : texColor;
}
`;

const solidVss = `\
#version 300 es

in vec4 position;

uniform mat4 world;
uniform mat4 viewProj;

void main() {
	gl_Position = viewProj * world * position;
}
`;

const solidFss = `\
#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
	outColor = vec4(0.5, 0.5, 0.5, 1);
}
`;

const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeTexcoordData = new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);
const cubePositionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);
const cubeTexcoordData = new Float32Array([
	0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
	0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0
]);
const cubeIndexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);
const frustumPositionData = new Float32Array([
	-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
	1, 1
]);
const frustumIndexData = new Uint8Array([
	0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6
]);

export default function ProjectionMapping(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const solidProgram = Program.fromSource(gl, solidVss, solidFss);

				const planePositionBuffer = new VertexBuffer(gl, planePositionData);
				const planeTexcoordBuffer = new VertexBuffer(gl, planeTexcoordData);
				const planeIndexBuffer = new ElementBuffer(gl, planeIndexData);
				const cubePositionBuffer = new VertexBuffer(gl, cubePositionData);
				const cubeTexcoordBuffer = new VertexBuffer(gl, cubeTexcoordData);
				const cubeIndexBuffer = new ElementBuffer(gl, cubeIndexData);
				const frustumPositionBuffer = new VertexBuffer(gl, frustumPositionData);
				const frustumIndexBuffer = new ElementBuffer(gl, frustumIndexData);

				const planeVao = new VertexArray(
					program,
					{
						position: { size: 2, vbo: planePositionBuffer },
						texcoord: { size: 2, vbo: planeTexcoordBuffer }
					},
					planeIndexBuffer
				);
				const cubeVao = new VertexArray(
					program,
					{
						position: cubePositionBuffer,
						texcoord: { size: 2, vbo: cubeTexcoordBuffer }
					},
					cubeIndexBuffer
				);
				const frustumVao = new VertexArray(
					solidProgram,
					{ position: frustumPositionBuffer },
					frustumIndexBuffer
				);

				const tex = new Texture2d(gl);
				tex.format = TextureFormat.LUMINANCE;
				tex.setMip(
					new Uint8Array([0x80, 0xc0, 0xc0, 0x80]),
					void 0,
					void 0,
					[0, 0, 2, 2]
				);
				tex.minFilter = TextureFilter.NEAREST;
				tex.magFilter = TextureFilter.NEAREST;
				const projTex = Texture2d.fromImageUrl(
					gl,
					new URL("/images/webgl-example-texture.png", domain).href
				);

				const planeMat = createMatrix4Like();
				identity(planeMat);
				rotateX(planeMat, (Math.PI * 3) / 2, planeMat);
				const cubeMat = createMatrix4Like();
				identity(cubeMat);
				scale(cubeMat, [0.1, 0.1, 0.1], cubeMat);
				translate(cubeMat, [1, 2, 1], cubeMat);
				const projProjMat = createMatrix4Like();
				perspective(Math.PI / 10, 1, 1, 3, projProjMat);
				const projCamMat = createMatrix4Like();
				identity(projCamMat);
				rotateX(projCamMat, -Math.PI / 5, projCamMat);
				translate(projCamMat, [0, 0, 2], projCamMat);
				const projViewMat = createMatrix4Like();
				invert(projCamMat, projViewMat);
				const projViewProjMat = createMatrix4Like();
				multiply(projProjMat, projViewMat, projViewProjMat);
				const texMat = createMatrix4Like();
				identity(texMat);
				translate(texMat, [0.5, 0.5, 0.5], texMat);
				scale(texMat, [0.5, 0.5, 0.5], texMat);
				multiply(texMat, projViewProjMat, texMat);
				const frustumMat = createMatrix4Like();
				invert(projViewProjMat, frustumMat);
				const camProjMat = createMatrix4Like();
				const camCamMat = createMatrix4Like();
				const camViewMat = createMatrix4Like();
				const camViewProjMat = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 0.1, 5, camProjMat);
					identity(camCamMat);
					rotateY(camCamMat, now * 0.0003, camCamMat);
					rotateX(camCamMat, -Math.PI / 5, camCamMat);
					translate(camCamMat, [0, 0, 2], camCamMat);
					invert(camCamMat, camViewMat);
					multiply(camProjMat, camViewMat, camViewProjMat);

					gl.fbo.draw(planeVao, {
						color: [1, 0, 0, 1],
						projTex,
						tex,
						texMat,
						viewProj: camViewProjMat,
						world: planeMat
					});

					gl.fbo.draw(cubeVao, {
						color: [0, 1, 0, 1],
						projTex,
						tex,
						texMat,
						viewProj: camViewProjMat,
						world: cubeMat
					});

					gl.fbo.draw(
						frustumVao,
						{ viewProj: camViewProjMat, world: frustumMat },
						Primitive.LINES
					);
				};
			}}
			{...props}
		/>
	);
}
