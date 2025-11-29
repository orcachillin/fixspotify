// requestErrorHandler.ts

import { maintenanceMode, setMaintenanceMode } from "../index.js"

export default class RequestErrorHandler {

    public static serverEnabled = !maintenanceMode

    public static async handleRequestError(error: any) {
        if (!error.response) return
        if (error.response.status === 429) {
            const retryAfter = error.response.headers["retry-after"]
            if (retryAfter) {
                const retryAfterSeconds = parseInt(retryAfter)
                if (retryAfterSeconds > 0) {
                    console.log(`Rate limit exceeded. shutting the ENTIRE server down for ${retryAfterSeconds} seconds.`)

                    setMaintenanceMode(true)
                    setTimeout(() => {
                        console.log("Rate limit exceeded. Restarting server.")
                        setMaintenanceMode(false)
                    }, retryAfterSeconds * 1000)
                }
            }
        }
    }
}
