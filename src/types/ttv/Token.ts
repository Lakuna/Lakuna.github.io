/**
 * A Twitch app access token.
 * @public
 */
export default interface Token {
	/** The access token. */
	access_token: string;

	/** The amount of time until the token expires in milliseconds. */
	expires_in: number;

	/** The type of the access token. */
	token_type: string;
}
