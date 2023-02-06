export {};

declare global {
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
            ip_addresses: string[],
            last_login: Date
        }
    }
}