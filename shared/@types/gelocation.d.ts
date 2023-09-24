export {};

declare global {
    // info we get back from api
    interface ResGeoLocation {
        ip: string;
        country: string;
        countryCode: string;
        flag: string;
        regionName: string;
        city: string;
        isp: string;
        org: string;
    }

    interface GeoLocation extends ResGeolocation {
        firstUsed: Date;
        lastUsed: Date;
    }
}