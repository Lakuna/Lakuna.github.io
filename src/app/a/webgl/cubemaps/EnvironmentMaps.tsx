"use client";

import {
	Context,
	ElementBuffer,
	Program,
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

export default function EnvironmentMaps(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const normalBuffer = new VertexBuffer(gl, normalData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const vao = new VertexArray(
					program,
					{ normal: normalBuffer, position: positionBuffer },
					indexBuffer
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

				const cam = identity(createMatrix4Like());
				translate(cam, [0, 0, 5], cam);
				const camPos = getTranslation(cam, createVector3Like());
				const view = invert(cam, createMatrix4Like());
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
					rotateY(world, now * 0.0001, world);
					rotateZ(world, now * 0.0002, world);
					normalFromMatrix4(world, normalMat);

					gl.fbo.draw(vao, { camPos, normalMat, tex, viewProj, world });
				};
			}}
			{...props}
		/>
	);
}
