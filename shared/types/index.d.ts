export {};

// shared types

import { ObjectId, Document } from 'mongodb';

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
        statistics: {
            geo_location: GeoLocation[],
            last_connected: Date,
            numberOfComments?: number
        }
    }

    type UserComment = {
        comment_id: string,
        replies_to_this?: string[], // comments replying to this comment
        replies_to_that?: string, // original comment this comment is replying to
        article: string,
        comment: string,
        userInfo: {
            email: string,
            username: string,
            profilePhoto: string,
            ip_address: string
        },
        statistics: {
            datetime: string | Date, // mongo returns object that we have to cast Date()
            likes: number,
            dislikes: number,
            geo_location: GeoLocation
        }
    }

    // --------------------------------
    // helper types
    type GeoLocateRes = {
        ip_address: string,
        country: string,
        regionName: string,
        city: string,
        isp: string,
        org: string
    }

    // extend geoLocateRes with ip address, first use and last use
    type GeoLocation = GeoLocateRes & {
        first_used: Date,
        last_used: Date
    }
}