export {};

// shared types
import { ObjectId, Document } from 'mongodb';
import * as es from "express-session";

declare global {
    type ServerRes<T = any> = {
        success: boolean,
        data?: T,
        error?: string
    }

    type PageData<T = any> = {
        docs: T[], // Document
        nextID?: ObjectId
    };

    // --------------------------------
    // messages from client
    type RegisterMessage = {
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string
    }

    type LoginMessage = {
        email: string,
        password: string
    }

    // session data
    // data stored in (req.session as SessionDataRes).user
    // session cookie extends UserInfo but removes some fields remove email.verified and email.verificationToken, password
    type SessionCookie = Omit<UserInfo, 'email' | 'password'> & {
        email: {
            address: string
        }
    }

    // req.session
    interface SessionData extends es.SessionData {
        authenticated?: boolean;
        user?: SessionCookie;
    }

    // --------------------------------
    // allow undefined for guest users
    type UserInfo = {
        name?: {
            first: string,
            last: string
        },
        profilePhoto: string,
        email?: {
            address: string,
            verified: boolean,
            verificationToken?: string
        },
        username: string,
        password?: string, // don't send password everytime
        metadata: {
            geo_locations: GeoLocation[],
            last_connected: Date,
            numberOfComments?: number,
            commentsJudged?: [
                {
                    comment_id: string,
                    judgement: 'like' | 'dislike'
                }
            ]
        }
    }

    type UserCommentReport = {
        comment_id: string,
        article: string,
        metadata: {
            user: {
                email: string,
                username: string
            },
            datetime: string | Date, // mongo returns object that we have to cast Date()
            geo_location: GeoLocation
        }
    }

    type UserComment = {
        comment_id: string,
        replies_to_this: string[], // comments replying to this comment
        replies_to_that?: string, // original comment this comment is replying to
        mentions: string[], // usernames mentioned in this comment
        article: string,
        comment: string,
        metadata: {
            user: {
                email: string,
                username: string,
                profilePhoto: string
            },
            datetime: string | Date, // mongo returns object that we have to cast Date()
            likes: number,
            dislikes: number,
            geo_location: GeoLocation
        }
    }

    // --------------------------------
    // extend geoLocateRes with ip address, first use and last use
    type GeoLocateRes = {
        ip_address: string,
        country: string,
        countryCode: string,
        flag: string,
        regionName: string,
        city: string,
        isp: string,
        org: string
    }

    type GeoLocation = GeoLocateRes & {
        first_used: Date,
        last_used: Date
    }
}