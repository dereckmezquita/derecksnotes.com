export {};

declare global {
    // info we get back from api
    interface ResGeolocation {
        ip: string;
        country: string;
        countryCode: string;
        flag: string;
        regionName: string;
        city: string;
        isp: string;
        org: string;
    }

    interface Geolocation extends ResGeolocation {
        firstUsed: Date;
        lastUsed: Date;
    }
}