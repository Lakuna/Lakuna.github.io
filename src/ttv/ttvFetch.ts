"use server";

import "util/env";
import getToken from "./getToken";

/**
 * Makes a request to a Twitch API endpoint. Automatically applies the Twitch API key to the `Authorization` header and the Twitch client ID to the `Client-Id` header.
 * @param input - The request input.
 * @param init - The request initialization data.
 * @param id - The Twitch client ID to use.
 * @param secret - The Twitch client secret to use.
 * @returns The response.
 * @throws `Error` if the response has a bad status or if the Twitch client ID or secret is missing.
 * @public
 */
export default async function ttvFetch(
	input: Request | RequestInfo | URL,
	init?: RequestInit,
	id: string | undefined = process.env["TWITCH_CLIENT_ID"],
	secret: string | undefined = process.env["TWITCH_CLIENT_SECRET"]
): Promise<Response> {
	if (!id || !secret) {
		throw new Error("Missing Twitch client ID or secret.");
	}

	const token = await getToken(id, secret);
	const request = new Request(input, init);
	request.headers.set("Authorization", `Bearer ${token.access_token}`);
	request.headers.set("Client-Id", id);
	const response = await fetch(request);
	if (!response.ok) {
		throw new Error(
			`Bad Twitch API response: ${JSON.stringify(await response.json())}`
		);
	}

	return response;
}
