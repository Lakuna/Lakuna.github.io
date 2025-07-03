"use client";

import { type JSX, useEffect, useState } from "react";
import TwitchStream, { type TwitchStreamProps } from "./TwitchStream";
import type StreamData from "types/ttv/StreamData";
import getStreams from "ttv/getStreams";

/**
 * Properties that can be passed to a potential Twitch stream embed.
 * @see {@link https://dev.twitch.tv/docs/embed/video-and-clips/ | Embedding Video and Clips}
 * @public
 */
export interface TwitchStreamIfLiveProps
	extends Omit<TwitchStreamProps, "channel"> {
	/** The ID of the user to get the stream of. */
	userId: string;

	/** The Twitch client ID to use. */
	id?: string;

	/** The Twitch client secret to use. */
	secret?: string;
}

/**
 * A Twitch stream embed if the selected Twitch stream is live, or nothing otherwise.
 * @param props - Properties to pass to the embed.
 * @returns The embed.
 * @throws `Error` if the channel name, video ID, and collection ID are all missing.
 * @public
 */
export default function TwitchStreamIfLive({
	userId,
	id,
	secret,
	...props
}: TwitchStreamIfLiveProps): JSX.Element | undefined {
	const [streamData, setStreamData] = useState<StreamData | undefined>(void 0);

	useEffect(() => {
		void getStreams(userId, id, secret).then(({ data }) => {
			setStreamData(data[0]);
		});
	}, [id, secret, userId]);

	return (
		streamData && <TwitchStream channel={streamData.user_login} {...props} />
	);
}
