import type { MetadataRoute } from "next";
import domain from "util/domain";

/**
 * The website's sitemap.
 * @returns The sitemap.
 * @public
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: new URL("/a/cccv", domain).href },
		{ url: new URL("/a/esojs", domain).href },
		{ url: new URL("/a/mc", domain).href },
		{ url: new URL("/a/mtg", domain).href },
		{ url: new URL("/a/pedit5", domain).href },
		{ url: new URL("/a/q_rsqrt", domain).href },
		{ url: new URL("/a/webgl/3d", domain).href },
		{ url: new URL("/a/webgl/attributes", domain).href },
		{ url: new URL("/a/webgl/cubemaps", domain).href },
		{ url: new URL("/a/webgl/fog", domain).href },
		{ url: new URL("/a/webgl/framebuffers", domain).href },
		{ url: new URL("/a/webgl/glossary", domain).href },
		{ url: new URL("/a/webgl/gpgpu", domain).href },
		{ url: new URL("/a/webgl/image-processing", domain).href },
		{ url: new URL("/a/webgl/intro", domain).href },
		{ url: new URL("/a/webgl/lighting", domain).href },
		{ url: new URL("/a/webgl/loss-of-context", domain).href },
		{ url: new URL("/a/webgl/picking", domain).href },
		{ url: new URL("/a/webgl/program-structure", domain).href },
		{ url: new URL("/a/webgl/scene-graph", domain).href },
		{ url: new URL("/a/webgl/shaders", domain).href },
		{ url: new URL("/a/webgl/skinning", domain).href },
		{ url: new URL("/a/webgl/text", domain).href },
		{ url: new URL("/a/webgl/textures", domain).href },
		{ url: new URL("/a/webgl/transformation", domain).href },
		{ url: new URL("/a/webgl/transparency", domain).href },
		{ url: new URL("/a/webgl/uniforms", domain).href },
		{ url: new URL("/a/webgl/varyings", domain).href },
		{ url: new URL("/a/webgl", domain).href },
		{ url: new URL("/blog", domain).href },
		{ url: new URL("/portfolio", domain).href },
		{ url: new URL("/", domain).href }
	];
}
