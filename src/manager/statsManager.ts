// statsManager.ts

import fs from "fs";
import path from "path";
import { Logger } from "@gurrrrrrett3/protocol";

export default class StatsManager {
  public static logger = new Logger("StatsManager");
  public static readonly countsPath = path.resolve("./counts.json");

  public static counts: {
    total: number;
    track: number;
    album: number;
    artist: number;
    playlist: number;
  };

  public static lastRequests: {
    addedAt: number;
    type: "track" | "album" | "artist" | "playlist";
    name: string;
    description: string;
    image: string;
    url: string;
  }[];

  public static saveInterval: NodeJS.Timeout | null = null;
  public static saveIntervalTime: number = 1000 * 60 * 5; // 5 minutes

  public static addRequest(
    type: "track" | "album" | "artist" | "playlist",
    id: string,
    name: string,
    description: string,
    image: string
  ) {
    this.addCount(type);

    // check if it already exists with the same url
    if (this.lastRequests.find((request) => request.url === id)) return;

    this.lastRequests.unshift({
      addedAt: Date.now(),
      type,
      name,
      description,
      image,
      url:
        type === "playlist"
          ? `https://open.spotify.com/playlist/${id}`
          : `https://open.fixspotify.com/view?type=${type}&id=${id}`,
    });

    if (this.lastRequests.length > 3) {
      this.lastRequests.pop();
    }
  }

  public static init() {
    if (!fs.existsSync(this.countsPath)) {
      fs.writeFileSync(
        this.countsPath,
        JSON.stringify(
          {
            total: 0,
            track: 0,
            album: 0,
            artist: 0,
            playlist: 0,
          },
          null,
          4
        )
      );
    }

    this.counts = JSON.parse(fs.readFileSync(this.countsPath, "utf-8"));
    this.lastRequests = [];

    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }

    this.saveInterval = setInterval(() => {
      this.save();
    }, this.saveIntervalTime);

    this.logger.log("Stats manager initialized");
  }

  public static save() {
    fs.writeFileSync(this.countsPath, JSON.stringify(this.counts, null, 4));
  }

  public static addCount(type: "track" | "album" | "artist" | "playlist") {
    this.counts[type as keyof typeof this.counts]++;
    this.counts.total++;
  }

  public static getCounts() {
    return this.counts;
  }

  public static getLastRequests(since?: number) {
    if (since) {
      return this.lastRequests.filter((request) => request.addedAt >= since);
    }
    return this.lastRequests;
  }
}
