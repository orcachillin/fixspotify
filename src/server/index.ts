import { Server, createServer } from "http";
import express, { Application } from "express";
import { resolve } from "path";
import openRouter from "./routers/open.js";
import indexRouter from "./routers/index.js";
import { Logger } from "@gurrrrrrett3/protocol";
import linkRouter from "./routers/link.js";
import apiRouter from "./routers/api.js";

export default class Webserver {

    public static readonly PORT: number = parseInt(process.env.PORT || "3000");
    public static readonly OPEN_SUBDOMAIN = "open"
    public static readonly LINK_DOMAIN = "fixspotify.link"

    public logger = new Logger("Webserver")

    public server: Server;
    public app: Application;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);

        this.app.disable("x-powered-by");
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        /*
            We need to serve three subdomains/domains:

            fixspotify.com
            open.fixspotify.com - handles actual embeds
            fixspotify.link - handles 
            
        */

        this.app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");

            if (req.hostname.startsWith(Webserver.OPEN_SUBDOMAIN + ".") || process.env.DEV_FORCE_OPEN === "true") {
                openRouter(req, res, next);
            } else if (req.hostname == Webserver.LINK_DOMAIN || process.env.DEV_FORCE_LINK == "true") {
                linkRouter(req, res, next)
            } else {
                indexRouter(req, res, next);
            }
        })

        this.app.use("/_", express.static(resolve("./dist/client/_")))
        this.app.use("/api", apiRouter)

    }

    public start(): void {

        this.server.on("error", (err) => {
            if ((err as any).code === "EADDRINUSE") {
                this.logger.error(`Port ${Webserver.PORT} is already in use. Please check if another instance of the server is running.`);
                return;
            }
            console.error(err);
        });

        this.server.listen(Webserver.PORT, () => {
            this.logger.log(`Server started on port ${Webserver.PORT}`);
        })
    }
}
