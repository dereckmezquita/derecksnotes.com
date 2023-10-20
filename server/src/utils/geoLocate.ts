import geoip from 'geoip-lite';
import countryLookup from 'country-code-lookup';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

export default function geoLocate(ip: string): GeolocationDTO {
    try {
        const geo = geoip.lookup(ip);

        // or if local ip
        if (!geo || ip === "::1" || ip === "") {
            throw new Error("Invalid IP address");
        }

        const country_name: string = countryLookup.byIso(geo.country)!.country;

        // check if geo is null if null return default
        return {
            ip: ip,
            country: country_name,
            countryCode: geo.country,
            flag: getUnicodeFlagIcon(geo.country),
            regionName: geo.region,
            city: geo.city
        };
    } catch (err: any) {
        console.error(`Failed to geolocate IP ${ip}: ${err.message}`);
        return {
            ip: ip,
            country: "Antarctica",
            countryCode: "AQ",
            flag: "🇦🇶",
            regionName: "Ross Dependency",
            city: "McMurdo Station",
        };
    }
}

export async function geoLocate2(ip: string): Promise<GeolocationDTO> {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city`);

        // Ensure the response is OK before proceeding.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const parsed_body = await response.json();

        if (parsed_body.status !== "success") {
            const message = parsed_body.message;

            if (typeof message === 'string') {
                throw new Error(message);
            }

            // can only get here if either status is undefined or status is fail and there is no message, which are both invalid cases.
            throw new Error("Invalid response from API");
        }

        delete parsed_body.status;

        return {
            ip: ip,
            ...parsed_body,
            flag: getUnicodeFlagIcon(parsed_body.countryCode)
        };
    } catch (err: any) {
        console.error(`Failed to geolocate IP ${ip}: ${err.message}`);

        return {
            ip: ip,
            country: "Antarctica",
            countryCode: "AQ",
            flag: "🇦🇶",
            regionName: "Ross Dependency",
            city: "McMurdo Station",
        };
    }
}

// ------------------------------------------------
// ------------------------------------------------
// import http from 'http';

// export function geoLocate2(ip: string): Promise<ResGeoLocation> {
//     return new Promise((resolve, reject) => { // promise just need to await it
//         const req = http.request(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,isp,org`, {
//             method: 'GET'
//         }, (res) => {
//             let body = "";

//             res.on('error', (err) => {
//                 reject(err);
//             });

//             res.on('data', (chunk) => {
//                 body += chunk; // in case the body is huge it will sent in chunks not all at once
//             });

//             res.on('end', () => {
//                 let parsed_body;

//                 try {
//                     parsed_body = JSON.parse(body);
//                 } catch (err) {
//                     reject("Response from API was not valid JSON.");
//                     return;
//                 }

//                 if (parsed_body.status !== "success") {
//                     const message = parsed_body.message;

//                     if (typeof message == 'string') {
//                         reject(message);
//                         return;
//                     }

//                     // can only get here if either status is undefined or status is fail and there is no message, which are both invalid cases.
//                     reject("Invalid response from API");
//                     return;
//                 }

//                 delete parsed_body.status;

//                 const locateRes: ResGeoLocation = {
//                     ip_address: ip,
//                     ...parsed_body,
//                     flag: getUnicodeFlagIcon(parsed_body.countryCode)
//                 }

//                 resolve(locateRes);
//             });
//         });

//         req.on('error', (err) => {
//             reject(err);
//         });

//         req.end();
//     });
// }