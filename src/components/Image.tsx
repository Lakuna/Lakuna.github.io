import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { JSX } from "react";
import defaultBlur from "./assets/default-blur.png";

/**
 * Equivalent to the props that can be passed to a Next.js image or an image element.
 * @public
 */
export type ImageProps = Omit<NextImageProps, "children"> & {
	/**
	 * Whether or not the image is trusted. Untrusted images don't use the Next.js image optimization API, so their `src` doesn't need to be a `trustedDomain`.
	 * @see {@link https://nextjs.org/docs/messages/next-image-unconfigured-host | Un-configured host}
	 */
	untrusted?: boolean | undefined;
};

/**
 * Create an image. Automatically applies default styling and configuration.
 * @param props - The properties to pass to the image.
 * @returns The image.
 * @public
 */
export default function Image({
	untrusted,
	...props
}: ImageProps): JSX.Element {
	// Untrusted images must use a string `src` value.
	if (untrusted) {
		if (typeof props.src !== "string") {
			throw new Error("Untrusted image must use a string source.");
		}

		// eslint-disable-next-line @next/next/no-img-element
		return <img {...props} alt={props.alt} src={props.src} />;
	}

	// Set default properties.
	props.placeholder ??= "blur";
	if (
		props.placeholder === "blur" &&
		typeof props.src === "string" &&
		defaultBlur.blurDataURL
	) {
		props.blurDataURL ??= defaultBlur.blurDataURL;
	}

	return <NextImage {...props} />;
}
