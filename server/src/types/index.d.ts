export {};

declare global {
    // used by shared type GeoLocation
    type GeoLocateRes = {
        ip_address: string,
        country: string,
        regionName: string,
        city: string,
        isp: string,
        org: string
    }
}