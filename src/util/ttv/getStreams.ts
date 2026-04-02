"use server";

import type Streams from "#/types/ttv/Streams.js";

import {
	array,
	boolean,
	enum as enum_,
	number,
	object,
	optional,
	string
} from "zod";

import ttvFetch from "./ttvFetch";

/* eslint-disable @typescript-eslint/naming-convention */
const streamsSchema = object({
	data: array(
		object({
			game_id: string(),
			game_name: string(),
			id: string(),
			is_mature: boolean(),
			language: string(),
			started_at: string(),
			tag_ids: array(string()),
			tags: array(string()),
			thumbnail_url: string(),
			title: string(),
			type: enum_(["", "live"]),
			user_id: string(),
			user_login: string(),
			user_name: string(),
			viewer_count: number()
		})
	),
	pagination: object({ cursor: optional(string()) })
});
/* eslint-enable @typescript-eslint/naming-convention */

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
	id: string | undefined = process.env["TWITCH_CLIENT_ID"],
	secret: string | undefined = process.env["TWITCH_CLIENT_SECRET"]
): Promise<Streams> {
	const url = new URL("/helix/streams", "https://api.twitch.tv/");
	url.searchParams.set("user_id", userId);

	const out = streamsSchema.safeParse(
		await (await ttvFetch(url, void 0, id, secret)).json()
	);
	if (!out.success) {
		throw new Error("Invalid Twitch streams.");
	}

	return out.data;
}
