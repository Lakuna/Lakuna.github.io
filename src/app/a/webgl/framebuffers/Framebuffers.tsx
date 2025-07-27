"use client";

import {
	Context,
	ElementBuffer,
	Framebuffer,
	FramebufferAttachment,
	Program,
	Renderbuffer,
	RenderbufferFormat,
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
	rotateZ,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import type { UglCanvasProps } from "app/a/webgl/UglCanvasProps";

const vss = `\
#version 300 es

in vec4 position;
in vec2 texcoord;

uniform mat4 matrix;

out vec2 vTexcoord;

void main() {
	gl_Position = matrix * position;
	vTexcoord = texcoord;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 vTexcoord;

uniform sampler2D tex;

out vec4 outColor;

void main() {
	outColor = texture(tex, vTexcoord);
}
`;

const positionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);
const texcoordData = new Float32Array([
	0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
	0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0
]);
const indexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);

export default function Framebuffers(props: UglCanvasProps): JSX.Element {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const texcoordBuffer = new VertexBuffer(gl, texcoordData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const cubeVao = new VertexArray(
					program,
					{
						position: positionBuffer,
						texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const redTexture = new Texture2d(gl);
				redTexture.format = TextureFormat.R8;
				redTexture.setMip(new Uint8Array([0xff]), 0, void 0, [0, 0, 1, 1]);

				const greenTexture = new Texture2d(gl);
				greenTexture.format = TextureFormat.RG8;
				greenTexture.setMip(
					new Uint8Array([0x00, 0xff]),
					0,
					void 0,
					[0, 0, 1, 1]
				);

				const renderTexture = new Texture2d(gl);
				renderTexture.setMip(void 0, 0, void 0, [0, 0, 0x100, 0x100]);
				renderTexture.minFilter = TextureFilter.NEAREST;
				renderTexture.magFilter = TextureFilter.NEAREST;

				const renderDepth = new Renderbuffer(
					gl,
					RenderbufferFormat.DEPTH_COMPONENT24,
					0x100,
					0x100
				);

				const framebuffer = new Framebuffer(gl);
				framebuffer.attach(0, renderTexture);
				framebuffer.attach(FramebufferAttachment.Depth, renderDepth);

				const camMat = createMatrix4Like();
				identity(camMat);
				translate(camMat, [0, 0, 5], camMat);
				const viewMat = createMatrix4Like();
				invert(camMat, viewMat);
				const innerCamMat = createMatrix4Like();
				identity(innerCamMat);
				translate(innerCamMat, [0, 0, 5], innerCamMat);
				const innerViewMat = createMatrix4Like();
				invert(innerCamMat, innerViewMat);
				const projMat = createMatrix4Like();
				const viewProjMat = createMatrix4Like();
				const innerProjMat = createMatrix4Like();
				const innerViewProjMat = createMatrix4Like();
				const redMat = createMatrix4Like();
				const greenMat = createMatrix4Like();
				const blueMat = createMatrix4Like();

				return (now) => {
					gl.fitDrawingBuffer();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, projMat);
					multiply(projMat, viewMat, viewProjMat);
					perspective(Math.PI / 4, 0x100 / 0x100, 1, 10, innerProjMat);
					multiply(innerProjMat, innerViewMat, innerViewProjMat);
					identity(redMat);
					rotateX(redMat, now * 0.001, redMat);
					rotateY(redMat, now * 0.001, redMat);
					multiply(innerViewProjMat, redMat, redMat);
					identity(greenMat);
					multiply(innerViewProjMat, greenMat, greenMat);
					identity(blueMat);
					rotateY(blueMat, now * 0.001, blueMat);
					rotateZ(blueMat, now * 0.001, blueMat);
					multiply(viewProjMat, blueMat, blueMat);

					gl.fitViewport(framebuffer);
					gl.doCullFace = true;
					gl.doDepthTest = true;
					framebuffer.clear([0, 0, 1, 1], 1, false);
					framebuffer.draw(cubeVao, { matrix: redMat, tex: redTexture });
					framebuffer.draw(cubeVao, { matrix: greenMat, tex: greenTexture });

					gl.fitViewport();
					gl.fbo.clear([0, 0, 0, 0]);
					gl.fbo.draw(cubeVao, { matrix: blueMat, tex: renderTexture });
				};
			}}
			{...props}
		/>
	);
}
