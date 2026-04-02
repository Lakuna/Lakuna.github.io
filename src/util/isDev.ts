/**
 * Whether or not this is a development environment.
 * @public
 */
const out: boolean =
	process.env["VERCEL_ENV"] === "development" ||
	process.env.NODE_ENV === "development";

export default out;
