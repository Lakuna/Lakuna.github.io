import "util/env";
import type Token from "types/ttv/Token";

/**
 * Get a Twitch app access token.
 * @param id - The Twitch client ID to use.
 * @param secret - The Twitch client secret to use.
 * @returns The Twitch app access token.
 * @see {@link https://dev.twitch.tv/docs/authentication/#app-access-tokens | App access tokens}
 * @throws `Error` if the response has a bad status or if the Twitch client ID or secret is missing.
 * @public
 */
export default async function getToken(
	id: string | undefined = process.env["TWITCH_CLIENT_ID"],
	secret: string | undefined = process.env["TWITCH_CLIENT_SECRET"]
): Promise<Token> {
	if (!id || !secret) {
		throw new Error("Missing Twitch client ID or secret.");
	}

	const response = await fetch(
		new URL("/oauth2/token", "https://id.twitch.tv/").href,
		{
			body: `client_id=${id}&client_secret=${secret}&grant_type=client_credentials`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: "POST"
		}
	);
	if (!response.ok) {
		throw new Error(
			`Bad Twitch API response: ${JSON.stringify(await response.json())}`
		);
	}

	return (await response.json()) as Token;
}
