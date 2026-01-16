import { Artist, Client as SpotifyApiClient, Track } from "spotify-api.js";
import { TrackCache } from "../cache/impl/track.js";
import { AlbumCache } from "../cache/impl/album.js";
import AnalyticsManager from "../analytics/analyticsManager.js";
import StatsManager from "../manager/statsManager.js";

export default class SpotifyClient {

    public client: SpotifyApiClient;

    constructor() {
        this.client = new SpotifyApiClient({
            token: {
                clientID: process.env.SPOTIFY_CLIENT_ID as string,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
            },
            retryOnRateLimit: false,
            cacheSettings: {
                albums: true,
                artists: true,
                tracks: true,
                playlists: true,
            }
        });
    }

    public formatArtists(artists: Artist[] | undefined): string {
        if (!artists) {
            return "";
        }

        return artists.map(artist => artist.name).join(", ");
    }

    public formatDuration(duration: number): string {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);

        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    }

    public formatNumber(number: number, precision: number = 2): string {
        const units = ["", "K", "M", "B", "T"];

        let unit = Math.floor((number.toFixed(0).length - 1) / 3) * 3;
        let num = number / Math.pow(10, unit);

        return num.toFixed(precision) + units[unit / 3];
    }

    public formatDate(date: string, datePrecision: string): string {
        const [year, month, day] = date.split("-");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        switch (datePrecision) {
            case "year":
                return year;
            case "month":
                return `${monthNames[parseInt(month) - 1]} ${year}`;
            case "day":
                return `${monthNames[parseInt(month) - 1]} ${day}, ${year}`;
            default:
                return "";
        }
    }

    public async getTrackEmbed(id: string): Promise<any> {
        const track = await TrackCache.getOrFetch(id);

        if (!track) {
            return null;
        }

        AnalyticsManager.sendEvent("track", {
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album,
            duration: track.duration,
            releaseDate: track.releaseDate,
        });

        StatsManager.addRequest("track", track.id, track.name, track.artists, `https://i.scdn.co/image/${track.albumArt}`);

        return {
            id: track.id,
            title: track.name,
            artist: track.artists,
            album: track.album,
            image: `https://i.scdn.co/image/${track.albumArt}`,
            url: track.url,
            description: [
                `By ${track.artists} • ${track.duration}`,
                track.totalTracks == 1 ? `On ${track.album} (Single)` : `Track ${track.trackNumber} of ${track.totalTracks} on ${track.album}`,
                `Released ${track.releaseDate}`
            ].join("\n")
        }

    }

    public async getAlbumEmbed(id: string): Promise<any> {
        const album = await AlbumCache.getOrFetch(id);

        if (!album) {
            return null;
        }

        AnalyticsManager.sendEvent("album", {
            id: album.id,
            name: album.name,
            artists: album.artists,
            releaseDate: album.releaseDate,
        });

        StatsManager.addRequest("album", album.id, album.name, album.artists, `https://i.scdn.co/image/${album.image}`);

        return {
            id: album.id,
            title: album.name,
            artist: album.artists,
            image: `https://i.scdn.co/image/${album.image}`,
            url: album.url,
            description: [
                `By ${album.artists}`,
                `Released ${album.releaseDate}`,
                `${album.totalTracks} tracks`,
                `${album.genres || ""}`,
                ...album.tracks?.slice(0, 10).map((track, index) => {
                    return `${index + 1}. ${track.name} • ${track.duration}`
                }) || "",
                '',
                album.tracks?.length! > 10 ? `${album.tracks?.length! - 10} more...` : ""
            ].join("\n")
        }
    }

    public async getPlaylistEmbed(id: string): Promise<any> {
        const [playlist, playlistTracks] = await Promise.all([
            this.client.playlists.get(id),
            this.client.playlists.getTracks(id, {
                limit: 5
            })
        ])

        if (!playlist) {
            return null;
        }

        AnalyticsManager.sendEvent("playlist", {
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            owner: playlist.owner.displayName,
            tracks: playlist.totalTracks
        });

        StatsManager.addRequest("playlist", playlist.id, playlist.name, playlist.owner.displayName || "", playlist.images[0].url);

        const tracks = (await this.client.tracks.getMultiple(playlistTracks.map(track => track.track!.id))).reduce((acc, track) => {
            acc[track.id] = track;
            return acc;
        }, {} as Record<string, Track>)

        return {
            id: playlist.id,
            title: playlist.name,
            description: [
                playlist.description,
                `By ${playlist.owner.displayName}`,
                `${playlist.totalTracks} tracks`,
                '',
                ...playlistTracks.map((playlistTrack, index) => {
                    if (!playlistTrack.track || playlistTrack.track.type == "episode") {
                        return "";
                    }
                    let track = tracks[playlistTrack.track?.id];
                    if (!track) {
                        return "";
                    }

                    return `${index + 1}. ${playlistTrack.track?.name} • ${this.formatArtists(track.artists)} • ${this.formatDuration(track.duration)}`
                }),
                '',
                playlist.totalTracks > 5 ? `${playlist.totalTracks - 5} more...` : ""
            ].join("\n"),
            image: playlist.images[0].url,
            url: playlist.externalURL.spotify
        }
    }

    public async getArtistEmbed(id: string): Promise<any> {
        const artist = await this.client.artists.get(id);

        if (!artist) {
            return null;
        }

        AnalyticsManager.sendEvent("artist", {
            id: artist.id,
            name: artist.name,
            genres: artist.genres?.join(", ") || "",
            totalFollowers: artist.totalFollowers,
            popularity: artist.popularity
        });

        StatsManager.addRequest("artist", artist.id, artist.name, artist.genres?.join(", ") || "", artist.images![0].url);

        return {
            id: artist.id,
            title: artist.name,
            description: [
                artist.genres?.join(", "),
                `${this.formatNumber(artist.totalFollowers!)} followers`,
                `${artist.popularity}% popularity`
            ].join("\n"),
            image: artist.images![0].url,
            url: artist.externalURL.spotify
        }
    }

    public async getTrackAudioPreview(id: string): Promise<string | null> {
        const track = await this.client.tracks.get(id);

        if (!track) {
            return null;
        }

        return track.previewURL;
    }


}