export {};

// shared types

import { ObjectId } from 'mongodb';

declare global {
    type ServerRes<T = any> = {
        success: boolean;
        data?: T;
        error?: string;
    }

    type PageData = { docs: Document[], nextID?: ObjectId };

    // --------------------------------
    // communication types
    type RegisterMessage = {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
    }

    type LoginMessage = {
        email: string;
        password: string;
    }

    // --------------------------------
    type UserInfoRes = {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        profilePhoto?: string; // if user didn't upload a profile photo
        numberOfComments: number;
        lastConnected?: Date;
        current_ip: string;
    };

    type UserInfo = {
        firstName: string,
        lastName: string,
        profilePhoto?: string, // might be unset
        email: {
            address: string,
            verified: boolean,
            verificationToken?: string
        },
        username: string,
        password?: string, // we don't want send password
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
            datetime: string | Date, // mongo returns object that we have to new Date()
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
}