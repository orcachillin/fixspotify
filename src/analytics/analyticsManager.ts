// analyticsManager.ts

import { Client, Logger } from "@gurrrrrrett3/protocol";
import { AnalyticsChannel } from "./analyticsChannel.js";
import CacheAnalytics from "./cacheAnalytics.js";

export default class AnalyticsManager {
  public static client: Client;
  public static logger = new Logger("AnalyticsManager");

  public static async init(clientId: string = process.env.CLIENT_ID as string): Promise<void> {
    this.client = new Client();

    this.client.once("connect", () => {
      AnalyticsChannel.send(this.client, "analytics:init", {
        clientId,
        events: {
          track: {
            id: "string",
            name: "string",
            artists: ["string"],
            album: "string",
            duration: "number",
          },
          album: {
            id: "string",
            name: "string",
            artists: ["string"],
          },
          artist: {
            id: "string",
            name: "string",
            albums: ["string"],
          },
          playlist: {
            id: "string",
            name: "string",
            description: "string",
            owner: "string",
            tracks: ["string"],
          },
          cache: {
            tracks: {
              size: "number",
              limitBy: "number",
              limitFactor: "number",
              pruneEnabled: "boolean",
              staleDataThreshold: "number",
              lastPrune: "number",
              requests: "number",
              hits: "number",
              misses: "number",
              hitRate: "number",
            },
            albums: {
              size: "number",
              limitBy: "number",
              limitFactor: "number",
              pruneEnabled: "boolean",
              staleDataThreshold: "number",
              lastPrune: "number",
              requests: "number",
              hits: "number",
              misses: "number",
              hitRate: "number",
            },
          },
        },
      });
    });

    CacheAnalytics.init();

    // no need to fully subscribe to the channel, we just need to register it
    this.client.registerChannel(AnalyticsChannel);

    AnalyticsManager.logger.info(`AnalyticsManager initialized with clientId: ${clientId}`);
  }

  public static async sendEvent(event: string, data: any) {
    if (!this.client) return; // analytics disabled or not initialized

    AnalyticsChannel.send(this.client, "analytics:event", {
      type: event,
      data: data,
    });
  }
}
