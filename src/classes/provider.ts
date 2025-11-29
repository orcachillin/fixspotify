// provider.ts

export default abstract class Provider {
    public abstract readonly id: string;
    public abstract readonly name: string;
    public abstract readonly color: string;
    public abstract readonly icon: string;
    public abstract readonly disabled: boolean;
    public abstract readonly supports: ProviderType[];

    public getTrack(name: string, artist: string, id: string): Promise<string | undefined> {
        if (!this.supportsType(ProviderType.Track)) return Promise.resolve(undefined);
        return this.search(`${name} ${artist}`)
    }
    public getAlbum(name: string, artist: string, id: string): Promise<string | undefined> {
        if (!this.supportsType(ProviderType.Album)) return Promise.resolve(undefined);
        return this.search(`${name} ${artist}`)
    }
    public getArtist(name: string, id: string): Promise<string | undefined> {
        if (!this.supportsType(ProviderType.Artist)) return Promise.resolve(undefined);
        return this.search(`${name}`)
    }
    public getPlaylist(id: string): Promise<string | undefined> {
        if (!this.supportsType(ProviderType.Playlist)) return Promise.resolve(undefined);
        return this.search(id)
    }

    public abstract search(query: string): Promise<string | undefined>;

    public supportsType(type: ProviderType): boolean {
        return this.supports.includes(type);
    }

    public async get(type: ProviderType, options: ProviderOptions): Promise<string | undefined> {

        if (!this.supportsType(type)) return undefined;

        switch (type) {
            case ProviderType.Track:
                return this.getTrack(options.name!, options.artist!, options.id!);
            case ProviderType.Album:
                return this.getAlbum(options.name!, options.artist!, options.id!);
            case ProviderType.Artist:
                return this.getArtist(options.name!, options.id!);
            case ProviderType.Playlist:
                return this.getPlaylist(options.id!);
        }
    }

    public static validateType(type: string): type is ProviderType {
        return Object.values(ProviderType).includes(type as ProviderType);
    }
}

export enum ProviderType {
    Track = "track",
    Album = "album",
    Playlist = "playlist",
    Artist = "artist"
}

export interface ProviderOptions {
    name?: string;
    artist?: string;
    id?: string;
}
