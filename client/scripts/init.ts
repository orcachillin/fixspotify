// init.ts

import { initNav } from "../components/nav.ts";
import { initDisclaimer } from "../components/disclaimer.ts";
import { initStats, cleanupStats } from "../components/stats.ts";
import { initSocials } from "../components/socials.ts";
import { initDiscordEmbed } from "../components/discordEmbed.ts";
import { initAvailableProviders } from "../components/availableProviders.ts";
import { initDisabledProviders } from "../components/disabledProviders.ts";

export { initNav } from "../components/nav.ts";
export { initDisclaimer } from "../components/disclaimer.ts";
export { initStats } from "../components/stats.ts";
export { initSocials } from "../components/socials.ts";
export { initDiscordEmbed } from "../components/discordEmbed.ts";
export { initAvailableProviders } from "../components/availableProviders.ts";
export { initDisabledProviders } from "../components/disabledProviders.ts";

export function initComponents() {
  initNav();
  initDisclaimer();
  initStats();
  initSocials();
  initDiscordEmbed();
  initAvailableProviders();
  initDisabledProviders();
}

export function cleanupComponents() {
  cleanupStats();
}

window.addEventListener("unload", cleanupComponents);

initComponents();
