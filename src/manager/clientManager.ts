// clientManager.ts

import { Logger } from "@gurrrrrrett3/protocol";
import SpotifyClient from "../clients/spotifyClient.js";
import TidalClient from "../clients/tidalClient.js";

export default class ClientManager {
  public static logger = new Logger("ClientManager");
  public static spotifyClient: SpotifyClient = new SpotifyClient();
  public static tidalClient: TidalClient | null = null;
  public static appleMusicClient: any = null; // Placeholder for Apple Music client
  public static pandoraClient: any = null; // Placeholder for Pandora client

  public static async init(): Promise<void> {
    // Initialize optional clients if credentials are provided
    if (process.env.TIDAL_CLIENT_ID && process.env.TIDAL_CLIENT_SECRET) {
      this.tidalClient = new TidalClient();
      this.logger.log("Initialized Spotify and Tidal clients");
    } else {
      this.logger.log("Initialized Spotify client (Tidal credentials not provided)");
    }
  }
}
