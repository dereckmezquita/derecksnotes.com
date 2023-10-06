export { };

declare global {
    // info we get back from api
    export interface GeolocationDTO {
        ip: string;
        country: string;
        countryCode: string;
        flag: string;
        regionName: string;
        city: string;
        isp: string;
        org: string;

        // added by us
        firstUsed?: Date;
        lastUsed?: Date;
    }
}