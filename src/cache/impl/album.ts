import ClientManager from "../../manager/clientManager.js";
import RequestErrorHandler from "../../manager/requestErrorHandler.js";
import UpdateableCache from "../updatableCache.js";

export interface MinimalAlbum {
    id: string;
    name: string;
    artists: string;
    releaseDate: string;
    totalTracks: number;
    tracks: AlbumTrack[];
    genres?: string
    url: string;
    image: string;
    images: string[];
}

export interface AlbumTrack {
    id: string;
    name: string;
    artists: string;
    duration: string;
}

export const AlbumCache = new UpdateableCache<MinimalAlbum>(async (id: string) => {
    const album = await ClientManager.spotifyClient.client.albums.get(id).catch((err) => {
        RequestErrorHandler.handleRequestError(err);
        return null;
    });

    if (!album) {
        return null;
    }

    return {
        id: album.id,
        name: album.name,
        artists: ClientManager.spotifyClient.formatArtists(album.artists),
        releaseDate: ClientManager.spotifyClient.formatDate(album?.releaseDate!, album.releaseDatePrecision!),
        totalTracks: album.totalTracks,
        genres: album.genres?.join(", "),
        tracks: album.tracks?.map((track) => {
            return {
                id: track.id,
                name: track.name,
                duration: ClientManager.spotifyClient.formatDuration(track.duration),
                artists: ClientManager.spotifyClient.formatArtists(track.artists)
            }
        }) || [],
        url: album.externalURL.spotify,
        image: album.images[0].url,
        images: album.images.map((image) => image.url.split("/").pop()!)
    }
}, {
    staleDataThreshold: -1,
});
