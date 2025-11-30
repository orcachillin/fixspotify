// open.ts

import { NextFunction, Request, Response, Router } from "express";
import { resolve } from "path";
import TemplateManager from "../../manager/templateManager.js";
import ProviderManager from "../../manager/providerManager.js";
import Provider, { ProviderType } from "../../classes/provider.js";
import fetch from "node-fetch";
import { TrackCache } from "../../cache/impl/track.js";
import { AlbumCache } from "../../cache/impl/album.js";
import { maintenanceMode } from "../../index.js";
import ClientManager from "../../manager/clientManager.js";
import { versionInfo } from "../../utils/version.js";
const openRouter = Router();

openRouter.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[OPEN] ${req.method} ${req.path}`);

  if (maintenanceMode) {
    res.redirect("https://fixspotify.com/");
    return;
  }

  const pathParts = req.path.split("/").filter((part) => part !== "");
  if (pathParts[0] && pathParts[0].startsWith("intl-")) {
    req.url = req.url.replace(`/${pathParts[0]}`, "");
    req.headers["accept-language"] = pathParts[0].replace("intl-", "");
  }

  next();
});

openRouter.get("/", (req, res) => {
  res.sendFile(resolve("./dist/client/pages/config.html"));
});

openRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "fixspotify",
    ...versionInfo,
  });
});

openRouter.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

openRouter.get("/view", (req, res) => {
  res.sendFile(resolve("./dist/client/pages/view.html"));
});

// https://open.spotify.com/track/id
openRouter.get("/track/:id", async (req, res) => {
  res.send(TemplateManager.getTemplate("track", await ClientManager.spotifyClient.getTrackEmbed(req.params.id)));
});

// https://open.spotify.com/album/id
openRouter.get("/album/:id", async (req, res) => {
  res.send(TemplateManager.getTemplate("album", await ClientManager.spotifyClient.getAlbumEmbed(req.params.id)));
});

// https://open.spotify.com/playlist/id
openRouter.get("/playlist/:id", async (req, res) => {
  res.send(TemplateManager.getTemplate("playlist", await ClientManager.spotifyClient.getPlaylistEmbed(req.params.id)));
});

// https://open.spotify.com/artist/id
openRouter.get("/artist/:id", async (req, res) => {
  res.send(TemplateManager.getTemplate("artist", await ClientManager.spotifyClient.getArtistEmbed(req.params.id)));
});

// handles redirecting to a provider
openRouter.get("/redirect/:provider/:type/:id", async (req, res) => {
  let provider = req.params.provider;

  if (!ProviderManager.validateProvider(provider)) {
    provider = "fixSpotify"; // default provider
  }

  const type = req.params.type;
  if (!Provider.validateType(type)) {
    res.status(400).send("Invalid type");
    return;
  }

  const url = await ProviderManager.getUrl(type, provider, req.params.id);

  if (!url) {
    res.status(404).sendFile(resolve("./dist/client/pages/error.html"));
    return;
  }

  res.redirect(url);
});

// get info
openRouter.get("/api", async (req, res) => {
  res.json({
    version: process.env.npm_package_version,
    providers: ProviderManager.providers,
  });
});

// get media info
openRouter.get("/api/info/:type/:id", async (req, res) => {
  const type = req.params.type;
  if (!Provider.validateType(type)) {
    res.status(400).send("Invalid type");
    return;
  }

  const id = req.params.id;

  switch (type) {
    case ProviderType.Track:
      const track = await TrackCache.getOrFetch(id);

      if (!track) {
        res.status(404).send("Track not found");
        return;
      }

      res.json({
        name: track.name,
        artists: track.artists,
        album: track.album,
        albumArt: `/api/image/${track.albumArt}`,
      });
      break;
    case ProviderType.Album:
      const album = await AlbumCache.getOrFetch(id);

      if (!album) {
        res.status(404).send("Album not found");
        return;
      }

      res.json({
        name: album.name,
        artists: album.artists,
        images: album.images.map((image) => `/api/image/${image}`),
        tracks: album.tracks?.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          duration: track.duration,
        })),
      });

      break;
    case ProviderType.Artist:
      const artist = await ClientManager.spotifyClient.client.artists.get(id);

      if (!artist) {
        res.status(404).send("Artist not found");
        return;
      }

      res.json({
        name: artist.name,
        genres: artist.genres?.join(", "),
        images: artist.images?.map((image) => {
          return `/api/image/${image.url.split("/").pop()}`;
        }),
      });

      break;
    case ProviderType.Playlist:
      const playlist = await ClientManager.spotifyClient.client.playlists.get(id);

      if (!playlist) {
        res.status(404).send("Playlist not found");
        return;
      }

      res.json({
        name: playlist.name,
        description: playlist.description,
        images: playlist.images.map((image) => {
          return `/api/image/${image.url.split("/").pop()}`;
        }),
      });

      break;
  }
});

// get image
openRouter.get("/api/image/:id", async (req, res) => {
  const id = req.params.id;
  const imageRes = await fetch(`https://i.scdn.co/image/${id}`);
  const imageBuffer = await imageRes.buffer();
  res.setHeader("Content-Type", "image/jpeg");
  res.send(imageBuffer);
});

// get provider list
openRouter.get("/api/providers", async (req, res) => {
  res.json(ProviderManager.providers);
});

export default openRouter;
