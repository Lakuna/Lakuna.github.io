/**
 * Information used to page through a list of results.
 * @public
 */
export default interface Pagination {
	/** The cursor used to get the next page of results. Missing if there are no more pages left to page through. */
	cursor?: string;
}
