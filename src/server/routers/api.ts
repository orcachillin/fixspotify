import { Router } from 'express';
import ProviderManager from '../../manager/providerManager.js';
import { ProviderType } from '../../classes/provider.js';
import { AlbumCache } from '../../cache/impl/album.js';
import ClientManager from '../../manager/clientManager.js';
const router = Router();

router.get("/convert", async (req, res) => {
    const provider = req.query.provider as string

    if (!provider || !ProviderManager.validateProvider(provider)) {
        res.status(400).json({
            success: false,
            error: `Please provide a valid provider id. One of "${Object.keys(ProviderManager.providers).join(" | ")}"`
        })
        return
    }

    const { type, id } = req.query as { type: string, id: string }

    if (!type || !id || !ProviderManager.validateType(type)) {
        res.status(400).json({
            success: false,
            error: `Please provide a valid resource type and resource id. Valid resource type is one of "${Object.values(ProviderType).join(" | ")}"`
        })
    }


    switch (type) {
        case ProviderType.Track: {
            const url = await ProviderManager.getUrl(ProviderType.Track, provider, id)

            if (url) {
                res.json({
                    success: true,
                    url
                })
            } else {
                res.json({
                    success: false,
                    error: "Failed to find info for this track."
                })
            }
            break
        }
        case ProviderType.Album: {
            const album = await AlbumCache.getOrFetch(id)

            if (!album) {
                res.json({
                    success: false,
                    error: "Failed to find info for this album."
                })
                return
            }

            const urls = await Promise.all(album.tracks.map((track) => ProviderManager.getUrl(ProviderType.Track, provider, track.id)))

            res.json({
                success: true,
                urls
            })
        }
        case ProviderType.Playlist: {
            const tracks = await ClientManager.spotifyClient.client.playlists.getTracks(id, {
                limit: 50
            })

            const urls = await Promise.all(tracks.map((playlistTrack) => playlistTrack.track && ProviderManager.getUrl(ProviderType.Track, provider, playlistTrack?.track.id)).filter(Boolean))

            res.json({
                success: true,
                urls
            })

        }
    }






})

export default router;