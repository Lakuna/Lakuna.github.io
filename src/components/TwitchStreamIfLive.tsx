"use client";

import type StreamData from "#/types/ttv/StreamData.js";
import type { JSX } from "react/jsx-runtime";

import getStreams from "#/util/ttv/getStreams.js";
import { useEffect, useState } from "react";

import TwitchStream, { type TwitchStreamProps } from "./TwitchStream";

/**
 * Properties that can be passed to a potential Twitch stream embed.
 * @see {@link https://dev.twitch.tv/docs/embed/video-and-clips/ | Embedding Video and Clips}
 * @public
 */
export interface TwitchStreamIfLiveProps extends Omit<
	TwitchStreamProps,
	"channel"
> {
	/** The Twitch client ID to use. */
	id?: string;

	/** The Twitch client secret to use. */
	secret?: string;

	/** The ID of the user to get the stream of. */
	userId: string;
}

/**
 * A Twitch stream embed if the selected Twitch stream is live, or nothing otherwise.
 * @param props - Properties to pass to the embed.
 * @returns The embed.
 * @throws `Error` if the channel name, video ID, and collection ID are all missing.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function TwitchStreamIfLive({
	id,
	secret,
	userId,
	...props
}: TwitchStreamIfLiveProps): JSX.Element | undefined {
	const [streamData, setStreamData] = useState<StreamData | undefined>(void 0);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		void getStreams(userId, id, secret).then(({ data }) => {
			setStreamData(data[0]);
		});
	}, [id, secret, userId]);

	return (
		streamData && <TwitchStream channel={streamData.user_login} {...props} />
	);
}
