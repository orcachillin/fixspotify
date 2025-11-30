// index.ts

import { Router, Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { TrackCache } from "../../cache/impl/track.js";
import { AlbumCache } from "../../cache/impl/album.js";
import { maintenanceMode } from "../../index.js";
import StatsManager from "../../manager/statsManager.js";
import { versionInfo } from "../../utils/version.js";
const indexRouter = Router();

indexRouter.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[INDEX] ${req.method} ${req.path}`);
  next();
});

indexRouter.get("/", (req, res) => {
  if (maintenanceMode) {
    res.sendFile(resolve("./dist/client/pages/down.html"));
    return;
  }

  res.sendFile(resolve("./dist/client/pages/index.html"));
});

indexRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "fixspotify",
    ...versionInfo,
  });
});

indexRouter.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

indexRouter.get("/stats", (req, res) => {
  const since = req.query.since ? parseInt(req.query.since as string) : 0;

  res.json({
    counts: StatsManager.getCounts(),
    lastRequests: StatsManager.getLastRequests(since),
  });
});

indexRouter.get("/cache", (req, res) => {
  res.json({
    tracks: TrackCache.info(),
    albums: AlbumCache.info(),
  });
});

indexRouter.get("/robots.txt", (req, res) => {
  res.sendFile(resolve("./client/assets/robots.txt"));
});

export default indexRouter;
