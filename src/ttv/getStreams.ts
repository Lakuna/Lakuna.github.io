import type Streams from "types/ttv/Streams";
import ttvFetch from "./ttvFetch";

/**
 * Get a list of streams.
 * @param userId - The ID of the user to get streams of.
 * @param id - The Twitch client ID to use.
 * @param secret - The Twitch client secret to use.
 * @returns The list of streams.
 * @throws `Error` if the response has a bad status or if the Twitch client ID or secret is missing.
 * @public
 */
export default async function getStreams(
	userId: string,
	id?: string,
	secret?: string
): Promise<Streams> {
	const url = new URL("/helix/streams", "https://api.twitch.tv/");
	url.searchParams.set("user_id", userId);

	return (await (await ttvFetch(url, void 0, id, secret)).json()) as Streams;
}
