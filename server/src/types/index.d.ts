export { };

import { SessionData } from "express-session";

declare global {
    // data stored in (req.session as SessionDataRes).user
    type SessionCookie = {
        email: string,
        username: string,
        profilePhoto?: string
    }

    // req.session
    interface SessionData extends SessionData {
        authenticated?: boolean;
        user?: SessionCookie;
    }

    // used by shared type GeoLocation
    type GeoLocateRes = {
        ip_address: string,
        country: string,
        regionName: string,
        city: string,
        isp: string,
        org: string
    }
}