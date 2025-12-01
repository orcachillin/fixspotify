// tidalClient.ts

import fetch from "node-fetch";
import { Logger } from "@gurrrrrrett3/protocol";

export default class TidalClient {
  private _clientId: string;
  private _clientSecret: string;

  private _token!: string;
  public logger = new Logger("TidalClient");

  // for Tidal, we need to set the country code
  // you cant set multiple country codes? so im just going to set it to US
  // not the biggest fan of this but it is what it is
  // maybe we can make it an option in the future
  public static readonly COUNTRY_CODE = "US";

  constructor() {
    this._clientId = process.env.TIDAL_CLIENT_ID as string;
    this._clientSecret = process.env.TIDAL_CLIENT_SECRET as string;

    if (!this._clientId || !this._clientSecret) {
      throw new Error("Tidal client ID and secret must be set in environment variables.");
    }

    this.getToken();
  }

  public async getToken() {
    if (!this._token) {
      await this._refreshToken();
    }
    return this._token;
  }

  private async _refreshToken() {
    const response = await fetch("https://auth.tidal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this._clientId}:${this._clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });
    const json = (await response.json()) as { access_token: string; expires_in: number };
    this._token = json.access_token;

    setTimeout(() => {
      this._refreshToken();
    }, json.expires_in * 1000);

    this.logger.debug(`Refreshed token. Expires in ${json.expires_in} seconds.`);
  }

  public async search(
    query: string,
    options?: { include?: TidalSearchType[] }
  ): Promise<TidalResponse<"searchResults">> {
    const url = `https://openapi.tidal.com/v2/searchResults/${encodeURIComponent(query)}?countryCode=${TidalClient.COUNTRY_CODE}${
      options?.include ? options.include.map((type) => `&include=${type}`).join("") : ""
    }`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        "Content-Type": "application/vnd.api+json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Failed to search Tidal: ${response.status} ${response.statusText} ${body}`);
      throw new Error(`Failed to search Tidal: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  }

  public async getTrack(id: string): Promise<TidalResponse<"tracks">> {
    const url = `https://openapi.tidal.com/v2/tracks/${id}?countryCode=${TidalClient.COUNTRY_CODE}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        "Content-Type": "application/vnd.api+json",
      },
    });

    const json = await response.json();
    return json;
  }

  public async getAlbum(id: string): Promise<TidalResponse<"albums">> {
    const url = `https://openapi.tidal.com/v2/albums/${id}?countryCode=${TidalClient.COUNTRY_CODE}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        "Content-Type": "application/vnd.api+json",
      },
    });

    const json = await response.json();
    return json;
  }

  public async getArtist(id: string): Promise<TidalResponse<"artists">> {
    const url = `https://openapi.tidal.com/v2/artists/${id}?countryCode=${TidalClient.COUNTRY_CODE}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`,
        "Content-Type": "application/vnd.api+json",
      },
    });

    const json = await response.json();
    return json;
  }
}

export interface TidalResponse<Type extends string = string> {
  type: Type;
  attributes: Attributes;
  included: Included[];
}

interface Included {
  id: string;
  type: string;
  attributes: Attributes;
}

interface Attributes {
  title: string;
  barcodeId: string;
  numberOfVolumes: number;
  numberOfItems: number;
  duration: string;
  explicit: boolean;
  releaseDate: string;
  copyright: string;
  popularity: number;
  availability: string[];
  mediaTags: string[];
  externalLinks: ExternalLink[];
  type: string;
}

interface ExternalLink {
  href: string;
  meta: {
    type: string;
  };
}

export enum TidalSearchType {
  Tracks = "tracks",
  Albums = "albums",
  Artists = "artists",
}
