"use client";

import {
	Context,
	ElementBuffer,
	Program,
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
	rotateX,
	rotateY,
	translate
} from "@lakuna/umath/Matrix4";
import {
	createVector3Like,
	fromValues,
	normalize
} from "@lakuna/umath/Vector3";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec3 normal;

uniform mat4 viewProj;
uniform mat4 world;
uniform mat3 normalMat;
uniform vec3 lightPos;
uniform vec3 camPos;

out vec3 vNormal;
out vec3 vDirToLight;
out vec3 vDirToCam;

void main() {
	vec4 worldPos = world * position;
	gl_Position = viewProj * worldPos;

	vNormal = normalMat * normal;

	vec3 surfacePos = worldPos.xyz;
	vDirToLight = lightPos - surfacePos;
	vDirToCam = camPos - surfacePos;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec3 vNormal;
in vec3 vDirToLight;
in vec3 vDirToCam;

uniform vec3 reverseLightDir;
uniform vec4 color;
uniform float ambientBrightness;
uniform float dullness;

out vec4 outColor;

void main() {
	vec3 normal = normalize(vNormal);
	vec3 dirToLight = normalize(vDirToLight);
	vec3 dirToCam = normalize(vDirToCam);
	vec3 halfVector = normalize(dirToLight + dirToCam);

	float diffuseBrightness = dot(normal, reverseLightDir);
	float specularBrightness = pow(max(dot(normal, halfVector), 0.0), dullness);
	float brightness = diffuseBrightness * 0.7 + specularBrightness + ambientBrightness;

	outColor = color;
	outColor.rgb *= brightness;
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

export default function PhongLighting(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const normalBuffer = new VertexBuffer(gl, normalData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const cubeVao = new VertexArray(
					program,
					{ normal: normalBuffer, position: positionBuffer },
					indexBuffer
				);

				const cam = identity(createMatrix4Like());
				rotateX(cam, -Math.PI / 5, cam);
				translate(cam, [0, 0, 5], cam);
				const camPos = getTranslation(cam, createVector3Like());
				const view = invert(cam, createMatrix4Like());
				const lightPos = fromValues(1, 1.4, 2, createVector3Like());
				const reverseLightDir = normalize(lightPos, createVector3Like());
				const world = createMatrix4Like();
				const proj = createMatrix4Like();
				const viewProj = createMatrix4Like();
				const normalMat = createMatrix3Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.fbo.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, proj);
					multiply(proj, view, viewProj);
					identity(world);
					rotateY(world, now * 0.001, world);
					normalFromMatrix4(world, normalMat);

					gl.fbo.draw(cubeVao, {
						ambientBrightness: 0.1,
						camPos,
						color: [1, 1, 1, 1],
						dullness: 8,
						lightPos,
						normalMat,
						reverseLightDir,
						viewProj,
						world
					});
				};
			}}
			{...props}
		/>
	);
}
