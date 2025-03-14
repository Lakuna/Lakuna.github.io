/**
 * Whether or not this is a development environment.
 * @public
 */
export default process.env["VERCEL_ENV"] === "development" ||
	process.env.NODE_ENV === "development";
