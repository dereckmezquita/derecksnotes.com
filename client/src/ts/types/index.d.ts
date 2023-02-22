export {};

declare global {
    interface Window {
        flexNav: Function;
        MathJax: Object;
    }

    interface Navigator {
        standalone: boolean;
    }

    type ServerRes<T = any> = {
        success: boolean;
        data?: T;
        error?: string;
    }

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
        email: {
            address: string,
            verified: boolean,
            verificationToken?: string
        },
        username: string,
        password: string,
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

    type UserCommentRes = {
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
}