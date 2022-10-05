import { AttributeState, Buffer, clearContext, Color, Program, resizeContext, Texture2D, TextureWrapFunction, UniformValue, VAO } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	v_texcoord = a_texcoord;
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
}`;

const positionBufferData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const texcoordBufferData = new Float32Array([
	-1, -1,
	-1, 2,
	2, 2,
	2, -1
]);

const indexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const transparent = new Color(0, 0, 0, 0);

export default function UmbraTextures({ ...props }) {
	return AnimatedCanvas((canvas: HTMLCanvasElement) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const texcoordBuffer = new Buffer(gl, texcoordBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer, 2),
			new AttributeState("a_texcoord", texcoordBuffer, 2)
		], indexData);

		const texture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
			width: 1,
			height: 1,
			wrapSFunction: TextureWrapFunction.CLAMP_TO_EDGE,
			wrapTFunction: TextureWrapFunction.CLAMP_TO_EDGE
		});

		const image = new Image();
		image.addEventListener("load", () => {
			texture.pixels = image;
			texture.width = undefined;
			texture.height = undefined;
			texture.update();
		});
		image.crossOrigin = "";
		image.src = "https://www.lakuna.pw/images/webgl-example-texture.png";

		const mat = mat4.create();

		return function render() {
			clearContext(gl, transparent);

			resizeContext(gl);

			mat4.identity(mat);
			if (canvas.clientWidth > canvas.clientHeight) {
				mat4.scale(mat, mat, [canvas.clientHeight / canvas.clientWidth, 1, 1]);
			} else {
				mat4.scale(mat, mat, [1, canvas.clientWidth / canvas.clientHeight, 1]);
			}

			vao.draw({ "u_matrix": mat as UniformValue, "u_texture": texture });
		}
	}, props);
}