// domainConfig.ts

import { Request } from "express";

export class DomainConfig {
  static getOpenDomain(): string {
    if (process.env.DEV_FORCE_OPEN === "true" && process.env.DEV_OPEN_DOMAIN) {
      return process.env.DEV_OPEN_DOMAIN;
    }
    return process.env.OPEN_DOMAIN || "https://open.fixspotify.com";
  }

  static getLinkDomain(): string {
    if (process.env.DEV_FORCE_LINK === "true" && process.env.DEV_LINK_DOMAIN) {
      return process.env.DEV_LINK_DOMAIN;
    }
    return process.env.LINK_DOMAIN || "https://fixspotify.link";
  }

  // Convenience method for current context
  static getCurrentDomain(req: Request): string {
    // Determine which router mode we're in based on env vars
    if (process.env.DEV_FORCE_OPEN === "true") {
      return this.getOpenDomain();
    } else if (process.env.DEV_FORCE_LINK === "true") {
      return this.getLinkDomain();
    }

    // In production, detect from hostname
    if (req.hostname.startsWith("open.")) {
      return this.getOpenDomain();
    } else if (req.hostname.includes("fixspotify.link")) {
      return this.getLinkDomain();
    }

    return this.getOpenDomain(); // default
  }
}
