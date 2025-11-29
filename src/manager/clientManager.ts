// clientManager.ts

import SpotifyClient from "../clients/spotifyClient.js";
import TidalClient from "../clients/tidalClient.js";

export default class ClientManager {

    public static spotifyClient: SpotifyClient = new SpotifyClient();
    public static tidalClient: TidalClient = new TidalClient();
    public static appleMusicClient: any = null; // Placeholder for Apple Music client
    public static pandoraClient: any = null; // Placeholder for Pandora client

    public static async init(): Promise<void> {
        // Initialize all clients, at the moment none of them are async so this is a placeholder
    }

}
