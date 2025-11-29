// analyticsChannel.ts

import { Channel } from "@gurrrrrrett3/protocol";

export const AnalyticsChannel = new Channel<{
    "analytics:init": {
        clientId: string,
        events: Record<string, AnalyticsEvent>
    },
    "analytics:event": {
        type: string,
        data: any,
    }
}>('analytics', {
    disableLogs: true,
})

type Primitive = "string" | "number" | "boolean"
type AnalyticsEvent = {
    [key: string]: Primitive | Primitive[] | AnalyticsEvent | AnalyticsEvent[]
}
