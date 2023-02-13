export { };

declare global {
    type ServerRes = {
        success: boolean;
        data?: any;
        error?: string;
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

    // data we can get back from: (req.session as SessionDataRes).user
    type UserCookie = {
        email: string,
        username: string
    }

    // req.session
    interface SessionDataRes extends SessionData {
        authenticated?: boolean;
        user?: UserCookie
    }
}