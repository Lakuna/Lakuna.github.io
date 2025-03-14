import type Pagination from "./Pagination";
import type StreamData from "./StreamData";

/**
 * A list of streams.
 * @public
 */
export default interface Streams {
	/** The list of streams. */
	data: StreamData[];

	/** The information used to page through the list of results. */
	pagination: Pagination;
}
