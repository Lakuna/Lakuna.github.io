/**
 * The properties that are passed to all pages.
 * @public
 */
export default interface PageProps<T extends object = object> {
	/**
	 * The dynamic route segments of this page.
	 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes | Dynamic Routes}
	 */
	params: Promise<T>;
}
