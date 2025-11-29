// link.ts

import { Router } from 'express';
import fetch from "node-fetch"

const linkRouter = Router();

const searchString = '<meta property="og:url" content="'

linkRouter.get("/", (req, res) => {
    res.redirect("https://fixspotify.com")
})

linkRouter.get("/:token", async (req, res) => {
    const appLinkRes = await fetch(`https://spotify.app.link/${req.params.token}`)
    const html = await appLinkRes.text()

    const index = html.indexOf(searchString) + searchString.length
    const endIndex = html.indexOf('"', index)

    const url = new URL(html.substring(index, endIndex))
    url.hostname = "open.fixspotify.com"
    res.redirect(url.toString())
})

export default linkRouter;
