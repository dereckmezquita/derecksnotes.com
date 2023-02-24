export { };

import { SessionData } from "express-session";

declare global {
    type ServerRes = {
        success: boolean;
        data?: any;
        error?: string;
    }

    // data we can get back from: (req.session as SessionDataRes).user
    type UserCookie = {
        email: string,
        username: string,
        profilePhoto?: string
    }

    // req.session
    interface SessionDataRes extends SessionData {
        authenticated?: boolean;
        user?: UserCookie | null;
    }

    type UserInfo = {
        firstName: string,
        lastName: string,
        profilePhoto?: string,
        email: {
            address: string
            verified: boolean,
            verificationToken?: string
        },
        username: string,
        password: string
        userStatistics: {
            ip_addresses: [
                {
                    ip_address: string,
                    first_use: Date,
                    last_use: Date
                }
            ],
            last_connected: Date
        }
    }

    type UserComment = {
        comment_id: string,
        replies_to_this?: string[], // comments replying to this comment
        replies_to_that?: string, // original comment this comment is replying to
        article: string,
        comment: string,
        commentInfo: {
            datetime: Date,
            likes: number,
            dislikes: number
        }
        userInfo: {
            email: string,
            username: string,
            profilePhoto?: string,
            ip_address: string
        }
    }

    type GeoLocateRes = {
        country: string;
        regionName: string;
        city: string;
        isp: string;
        org: string;
    }
}