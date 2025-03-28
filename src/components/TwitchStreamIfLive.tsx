import TwitchStream, { type TwitchStreamProps } from "./TwitchStream";
import type { JSX } from "react";
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
export default async function TwitchStreamIfLive({
	userId,
	id,
	secret,
	...props
}: TwitchStreamIfLiveProps): Promise<JSX.Element | undefined> {
	try {
		const [streamData] = (await getStreams(userId, id, secret)).data;
		return (
			streamData && <TwitchStream channel={streamData.user_login} {...props} />
		);
	} catch {
		return void 0;
	}
}
