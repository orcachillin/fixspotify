// cacheAnalytics.ts

import { AlbumCache } from "../cache/impl/album.js";
import { TrackCache } from "../cache/impl/track.js";
import AnalyticsManager from "./analyticsManager.js";

export default class CacheAnalytics {
    public static init() {
        setInterval(() => {
            const trackCache = TrackCache.info();
            const albumCache = AlbumCache.info();

            AnalyticsManager.sendEvent("cache", {
                tracks: trackCache,
                albums: albumCache,
            });
        }, 60000); // 1 minute interval
    }
}
