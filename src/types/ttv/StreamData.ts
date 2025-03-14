/**
 * A stream.
 * @public
 */
export default interface StreamData {
	/** An ID that identifies the stream. */
	id: string;

	/** The ID of the user that is broadcasting the stream. */
	user_id: string;

	/** The user's login name. */
	user_login: string;

	/** The user's display name. */
	user_name: string;

	/** The ID of the category or game being played. */
	game_id: string;

	/** The name of the category or game being played. */
	game_name: string;

	/** The type of stream. May be empty if an error occurred. */
	type: "live" | "";

	/** The stream's title. May be empty if the stream's title is not set. */
	title: string;

	/** The tags applied to the stream. */
	tags: string[];

	/** The number of users watching the stream. */
	viewer_count: number;

	/** The UTC date and time in RFC3339 format of when the broadcast began. */
	started_at: string;

	/** The language that the stream uses as an ISO 639-1 two-letter language code or `"other"` if the stream uses a language not in the list of supported stream languages. */
	language: string;

	/** A URL to an image of a frame from the last five minutes of the stream. */
	thumbnail_url: string;

	/** A deprecated field. */
	tag_ids: [];

	/** Whether or not the stream is meant for mature audiences. */
	is_mature: boolean;
}
