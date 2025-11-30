// tidalProvider.ts

import Provider, { ProviderType } from "../classes/provider.js";
import { TidalSearchType } from "../clients/tidalClient.js";
import ClientManager from "../manager/clientManager.js";

export default class TidalProvider extends Provider {
  public readonly id = "tidal";
  public readonly name = "Tidal";
  public readonly color = "#ffffff";
  public readonly icon = "tidal";
  public readonly disabled = false;
  public readonly supports = [ProviderType.Track, ProviderType.Album, ProviderType.Artist];

  public async search(query: string, type?: TidalSearchType): Promise<string | undefined> {
    // Return undefined if Tidal client is not initialized
    if (!ClientManager.tidalClient) {
      return undefined;
    }

    const res = await ClientManager.tidalClient.search(query, {
      include: [type || TidalSearchType.Tracks],
    });

    // TODO quick fix, if there's a feature request for a better way to do this, please open an issue
    // the tidal api is a bit weird, and the search endpoint returns a lot of data i do not need
    // i also dont have tidal so it's hard to test

    return res.included.sort((a, b) => b.attributes.popularity - a.attributes.popularity)[0].attributes.externalLinks[0]
      .href;
  }

  public async getTrack(name: string, artist: string, _id: string): Promise<string | undefined> {
    return this.search(`${name} ${artist}`, TidalSearchType.Tracks);
  }

  public async getAlbum(name: string, artist: string, _id: string): Promise<string | undefined> {
    return this.search(`${name} ${artist}`, TidalSearchType.Albums);
  }

  public async getArtist(name: string, _id: string): Promise<string | undefined> {
    return this.search(name, TidalSearchType.Artists);
  }
}
