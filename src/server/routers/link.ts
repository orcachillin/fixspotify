// link.ts

import { Router, Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { DomainConfig } from "../utils/domainConfig.js";

const linkRouter = Router();

const searchString = '<meta property="og:url" content="';

linkRouter.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[LINK] ${req.method} ${req.path}`);
  next();
});

linkRouter.get("/", (req, res) => {
  res.redirect("https://fixspotify.com");
});

linkRouter.get("/:token", async (req, res) => {
  const appLinkRes = await fetch(`https://spotify.app.link/${req.params.token}`);
  const html = await appLinkRes.text();

  const index = html.indexOf(searchString) + searchString.length;
  const endIndex = html.indexOf('"', index);

  const url = new URL(html.substring(index, endIndex));

  // Use configured open domain instead of hardcoded value
  const openDomain = DomainConfig.getOpenDomain();
  const parsedOpenDomain = new URL(openDomain);

  url.hostname = parsedOpenDomain.hostname;
  url.protocol = parsedOpenDomain.protocol.replace(":", "");
  if (parsedOpenDomain.port) {
    url.port = parsedOpenDomain.port;
  }

  res.redirect(url.toString());
});

export default linkRouter;
