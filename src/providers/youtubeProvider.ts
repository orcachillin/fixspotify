// youtubeProvider.ts

import ytsr from "@distube/ytsr";
import Provider, { ProviderType } from "../classes/provider.js";

export default class YoutubeProvider extends Provider {
    public readonly id = "youtube";
    public readonly name = "YouTube";
    public readonly color = "#FF0000";
    public readonly icon = "youtube";
    public readonly disabled = false;
    public readonly supports = [ProviderType.Track, ProviderType.Album];

    public async getTrack(name: string, artist: string): Promise<string | undefined> {
        return this.search(`${name} ${artist} audio`, "video")
    }

    public async getAlbum(name: string, artist: string): Promise<string | undefined> {
        return this.search(`${name} ${artist} album`, "playlist")
    }

    public async search(query: string, type?: ytsr.Options["type"]): Promise<string | undefined> {
        const res = await ytsr(query, { limit: 1, type })
        if (!res.items.length) return undefined;
        return res.items[0].url
    }

}
