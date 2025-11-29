// index.ts

import "dotenv/config";
import Webserver from "./server/index.js";
import TemplateManager from "./manager/templateManager.js";
import ProviderManager from "./manager/providerManager.js";
import AnalyticsManager from "./analytics/analyticsManager.js";
import StatsManager from "./manager/statsManager.js";
import ClientManager from "./manager/clientManager.js";

const server = new Webserver();

server.start();
TemplateManager.loadTemplates();
ClientManager.init();
ProviderManager.loadProviders();
StatsManager.init();

if (process.env.ANALYTICS_ENABLED === "true") {
    AnalyticsManager.init(process.env.ANALYTICS_INSTANCE_ID as string);
}

export function setMaintenanceMode(mode: boolean) {
    if (mode) {
        console.log("Maintenance mode enabled");
    } else {
        console.log("Maintenance mode disabled");
    }
    maintenanceMode = mode;
}

export var maintenanceMode = process.env.MAINTENANCE_MODE === "true" || false;
