"use client";

import {
	Context,
	ElementBuffer,
	Framebuffer,
	FramebufferAttachment,
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
	ortho,
	perspective,
	rotateX,
	rotateY,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "../UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec2 texcoord;

uniform mat4 viewProj;
uniform mat4 world;
uniform mat4 texMat;

out vec2 vTexcoord;
out vec4 vProjTexcoord;

void main() {
	vec4 worldPos = world * position;
	gl_Position = viewProj * worldPos;
	vTexcoord = texcoord;
	vProjTexcoord = texMat * worldPos;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 vTexcoord;
in vec4 vProjTexcoord;

uniform vec4 color;
uniform sampler2D tex;
uniform sampler2D projTex;

out vec4 outColor;

void main() {
	vec3 projTexcoord = vProjTexcoord.xyz / vProjTexcoord.w;
	float depth = projTexcoord.z;

	bool inShadow = projTexcoord.x >= 0.0
		&& projTexcoord.x <= 1.0
		&& projTexcoord.y >= 0.0
		&& projTexcoord.y <= 1.0;

	float projDepth = texture(projTex, projTexcoord.xy).r;
	float shadowLight = inShadow && projDepth <= depth ? 0.2 : 1.0;

	outColor = texture(tex, vTexcoord) * color;
	outColor.rgb *= shadowLight;
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
const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeTexcoordData = new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);
const frustumPositionData = new Float32Array([
	-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
	1, 1
]);
const frustumIndexData = new Uint8Array([
	0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6
]);

export default function ShadowMaps(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const solidProgram = Program.fromSource(gl, solidVss, solidFss);

				const cubePositionBuffer = new VertexBuffer(gl, cubePositionData);
				const cubeTexcoordBuffer = new VertexBuffer(gl, cubeTexcoordData);
				const cubeIndexBuffer = new ElementBuffer(gl, cubeIndexData);
				const planePositionBuffer = new VertexBuffer(gl, planePositionData);
				const planeTexcoordBuffer = new VertexBuffer(gl, planeTexcoordData);
				const planeIndexBuffer = new ElementBuffer(gl, planeIndexData);
				const frustumPositionBuffer = new VertexBuffer(gl, frustumPositionData);
				const frustumIndexBuffer = new ElementBuffer(gl, frustumIndexData);

				const cubeVao = new VertexArray(
					program,
					{
						position: cubePositionBuffer,
						texcoord: { size: 2, vbo: cubeTexcoordBuffer }
					},
					cubeIndexBuffer
				);

				const planeVao = new VertexArray(
					program,
					{
						position: { size: 2, vbo: planePositionBuffer },
						texcoord: { size: 2, vbo: planeTexcoordBuffer }
					},
					planeIndexBuffer
				);

				const solidCubeVao = new VertexArray(
					solidProgram,
					{ position: cubePositionBuffer },
					cubeIndexBuffer
				);

				const solidPlaneVao = new VertexArray(
					solidProgram,
					{ position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
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
					0,
					void 0,
					[0, 0, 2, 2]
				);
				tex.minFilter = TextureFilter.NEAREST;
				tex.magFilter = TextureFilter.NEAREST;

				const projTex = new Texture2d(gl);
				projTex.format = TextureFormat.DEPTH_COMPONENT32F;
				projTex.setMip(void 0, 0, void 0, [0, 0, 0x80, 0x80]);
				projTex.minFilter = TextureFilter.NEAREST;
				projTex.magFilter = TextureFilter.NEAREST;

				const framebuffer = new Framebuffer(gl);
				framebuffer.attach(FramebufferAttachment.Depth, projTex);

				const plane = identity(createMatrix4Like());
				rotateX(plane, (Math.PI * 3) / 2, plane);
				const cube = identity(createMatrix4Like());
				scale(cube, [0.1, 0.1, 0.1], cube);
				translate(cube, [1, 2, 1], cube);
				rotateY(cube, Math.PI / 4, cube);
				const lightProj = ortho(
					-0.5,
					0.5,
					-0.5,
					0.5,
					1,
					3,
					createMatrix4Like()
				);
				const lightCam = identity(createMatrix4Like());
				rotateX(lightCam, -Math.PI / 5, lightCam);
				translate(lightCam, [0, 0, 2], lightCam);
				const lightView = invert(lightCam, createMatrix4Like());
				const lightViewProj = multiply(
					lightProj,
					lightView,
					createMatrix4Like()
				);
				const texMat = identity(createMatrix4Like());
				translate(texMat, [0.5, 0.5, 0.5], texMat);
				scale(texMat, [0.5, 0.5, 0.5], texMat);
				multiply(texMat, lightViewProj, texMat);
				const frustum = invert(lightViewProj, createMatrix4Like());
				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();
				const viewProj = createMatrix4Like();

				return (now) => {
					gl.fitDrawingBuffer();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 0.1, 5, proj);
					identity(cam);
					rotateY(cam, now * 0.0003, cam);
					rotateX(cam, -Math.PI / 5, cam);
					translate(cam, [0, 0, 2], cam);
					invert(cam, view);
					multiply(proj, view, viewProj);

					gl.fitViewport(framebuffer);
					gl.doCullFace = true;
					gl.doDepthTest = true;
					framebuffer.clear(true, true, false);

					framebuffer.draw(solidPlaneVao, {
						viewProj: lightViewProj,
						world: plane
					});

					framebuffer.draw(solidCubeVao, {
						viewProj: lightViewProj,
						world: cube
					});

					gl.fitViewport();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.fbo.clear();

					gl.fbo.draw(planeVao, {
						color: [1, 0, 0, 1],
						projTex,
						tex,
						texMat,
						viewProj,
						world: plane
					});

					gl.fbo.draw(cubeVao, {
						color: [0, 1, 0, 1],
						projTex,
						tex,
						texMat,
						viewProj,
						world: cube
					});

					gl.fbo.draw(
						frustumVao,
						{ viewProj, world: frustum },
						Primitive.LINES
					);
				};
			}}
			{...props}
		/>
	);
}
