"use client";

import {
	Context,
	ElementBuffer,
	Program,
	TestFunction,
	TextureCubemap,
	TextureFilter,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import { createMatrix3Like, normalFromMatrix4 } from "@lakuna/umath/Matrix3";
import {
	createMatrix4Like,
	getTranslation,
	identity,
	invert,
	multiply,
	perspective,
	rotateY,
	rotateZ,
	setTranslation,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";
import { createVector3Like } from "@lakuna/umath/Vector3";
import domain from "util/domain";

const vss = `\
#version 300 es

in vec4 position;
in vec3 normal;

uniform mat4 viewProj;
uniform mat4 world;
uniform mat3 normalMat;

out vec3 vWorldPos;
out vec3 vNormal;

void main() {
	vec4 worldPos = world * position;
	gl_Position = viewProj * worldPos;
	vWorldPos = worldPos.xyz;
	vNormal = normalMat * normal;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec3 vWorldPos;
in vec3 vNormal;

uniform samplerCube tex;
uniform vec3 camPos;

out vec4 outColor;

void main() {
	vec3 normal = normalize(vNormal);
	vec3 camToSurfaceDir = normalize(vWorldPos - camPos);
	vec3 reflectDir = reflect(camToSurfaceDir, normal);
	outColor = texture(tex, reflectDir);
}
`;

const skyboxVss = `\
#version 300 es

in vec4 position;

out vec4 vPosition;

void main() {
	gl_Position = position;
	gl_Position.z = 1.0;

	vPosition = position;
}
`;

const skyboxFss = `\
#version 300 es

precision mediump float;

in vec4 vPosition;

uniform samplerCube tex;
uniform mat4 invViewDirProj;

out vec4 outColor;

void main() {
	vec4 t = invViewDirProj * vPosition;
	vec3 skyboxNormal = normalize(t.xyz / t.w);
	outColor = texture(tex, skyboxNormal);
}
`;

const positionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);
const normalData = new Float32Array([
	0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
	-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
	1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
]);
const indexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);
const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function Skyboxes(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const skyboxProgram = Program.fromSource(gl, skyboxVss, skyboxFss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const normalBuffer = new VertexBuffer(gl, normalData);
				const indexBuffer = new ElementBuffer(gl, indexData);
				const planePositionBuffer = new VertexBuffer(gl, planePositionData);
				const planeIndexBuffer = new ElementBuffer(gl, planeIndexData);

				const vao = new VertexArray(
					program,
					{ normal: normalBuffer, position: positionBuffer },
					indexBuffer
				);

				const skyboxVao = new VertexArray(
					skyboxProgram,
					{ position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
				);

				const tex = TextureCubemap.fromImageUrls(
					gl,
					new URL("/images/webgl-example-environment-map/px.png", domain).href,
					new URL("/images/webgl-example-environment-map/nx.png", domain).href,
					new URL("/images/webgl-example-environment-map/py.png", domain).href,
					new URL("/images/webgl-example-environment-map/ny.png", domain).href,
					new URL("/images/webgl-example-environment-map/pz.png", domain).href,
					new URL("/images/webgl-example-environment-map/nz.png", domain).href
				);
				tex.minFilter = TextureFilter.LINEAR_MIPMAP_LINEAR;
				tex.magFilter = TextureFilter.LINEAR;

				const cam = createMatrix4Like();
				const camPos = createVector3Like();
				const view = createMatrix4Like();
				const viewDir = createMatrix4Like();
				const world = createMatrix4Like();
				const proj = createMatrix4Like();
				const viewProj = createMatrix4Like();
				const viewDirProj = createMatrix4Like();
				const invViewDirProj = createMatrix4Like();
				const normalMat = createMatrix3Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.depthFunction = TestFunction.LEQUAL;
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, proj);
					identity(cam);
					rotateY(cam, now * 0.0001, cam);
					translate(cam, [0, 0, 5], cam);
					getTranslation(cam, camPos);
					invert(cam, view);
					setTranslation(view, [0, 0, 0], viewDir);
					multiply(proj, view, viewProj);
					multiply(proj, viewDir, viewDirProj);
					invert(viewDirProj, invViewDirProj);
					identity(world);
					rotateZ(world, now * 0.0002, world);
					normalFromMatrix4(world, normalMat);

					gl.fbo.draw(vao, { camPos, normalMat, tex, viewProj, world });

					gl.fbo.draw(skyboxVao, { invViewDirProj, tex });
				};
			}}
			{...props}
		/>
	);
}
