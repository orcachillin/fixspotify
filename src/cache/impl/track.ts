import UpdateableCache from "../updatableCache.js";
import ClientManager from "../../manager/clientManager.js";
import RequestErrorHandler from "../../manager/requestErrorHandler.js";

export interface MinimalTrack {
    id: string;
    name: string;
    artists: string;
    duration: string;
    album?: string;
    albumArt?: string;
    totalTracks?: number;
    trackNumber: number;
    releaseDate?: string;
    url: string;
}

export const TrackCache = new UpdateableCache<MinimalTrack>(async (id: string) => {
    const track = await ClientManager.spotifyClient.client.tracks.get(id).catch((err) => {
        RequestErrorHandler.handleRequestError(err);
        return null;
    })

    if (!track) {
        return null;
    }

    return {
        id: track.id,
        name: track.name,
        artists: ClientManager.spotifyClient.formatArtists(track.artists),
        duration: ClientManager.spotifyClient.formatDuration(track.duration!),
        album: track.album?.name || "unknown",
        albumArt: track.album ? track.album.images ? track.album.images[0].url.split("/").pop()! : "" : undefined,
        images: track.album ? track.album.images.map((image) => image.url.split("/").pop()!) : undefined,
        totalTracks: track.album?.totalTracks,
        trackNumber: track.trackNumber
            ? track.trackNumber : 0,
        releaseDate: track.album ? ClientManager.spotifyClient.formatDate(track.album!.releaseDate, track.album!.releaseDatePrecision) : undefined,
        url: track.externalURL.spotify
    }
}, {
    staleDataThreshold: -1,
});

