export {};

declare global {
    interface Window {
        flexNav: Function;
        MathJax: Object;
    }

    interface Navigator {
        standalone: boolean;
    }

    type ServerRes = {
        success: boolean;
        data?: any;
        error?: string;
    }

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
}