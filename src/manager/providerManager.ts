// providerManager.ts

import { resolve } from "path";
import Provider, { ProviderType } from "../classes/provider.js";
import { readdirSync } from "fs";
import { TrackCache } from "../cache/impl/track.js";
import { AlbumCache } from "../cache/impl/album.js";
import { Logger } from "@gurrrrrrett3/protocol";
import ClientManager from "./clientManager.js";

export default class ProviderManager {
    public static providers: Record<string, Provider> = {}
    public static logger = new Logger("ProviderManager")

    public static async loadProviders(): Promise<void> {
        // Load providers from providers directory
        const providersDir = resolve("./dist/providers")
        const providerFiles = readdirSync(providersDir).filter(file => file.endsWith(".js"))

        for (const file of providerFiles) {
            const provider = new (await import(resolve(providersDir, file))).default as Provider
            this.logger.log(`Loaded provider ${provider.id}`)
            ProviderManager.providers[provider.id] = provider
        }
    }

    public static validateProvider(provider: string): boolean {
        return !!ProviderManager.providers[provider]
    }

    public static async getUrl(type: ProviderType, provider: string, id: string): Promise<string | undefined> {
        if (!ProviderManager.providers[provider]) return undefined;

        switch (type) {
            case ProviderType.Track: {
                const track = await TrackCache.getOrFetch(id)
                if (!track) return undefined;

                return ProviderManager.providers[provider].get(type, {
                    name: track.name,
                    artist: track.artists.split(", ")[0],
                    id
                })
            }
            case ProviderType.Album: {
                const album = await AlbumCache.getOrFetch(id)
                if (!album) return undefined;

                return ProviderManager.providers[provider].get(type, {
                    name: album.name,
                    artist: album.artists.split(", ")[0],
                    id
                })
            }
            case ProviderType.Artist: {
                const artist = await ClientManager.spotifyClient.client.artists.get(id)
                if (!artist) return undefined;

                return ProviderManager.providers[provider].get(type, {
                    name: artist.name,
                    id
                })
            }
            case ProviderType.Playlist: {
                const playlist = await ClientManager.spotifyClient.client.playlists.get(id)
                if (!playlist) return undefined;

                return ProviderManager.providers[provider].get(type, {
                    id
                })
            }

        }

    }

}
