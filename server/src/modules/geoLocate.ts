import http from 'http';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

export const geoLocate = (ip: string): Promise<GeoLocateRes> => {
    return new Promise((resolve, reject) => { // promise just need to await it
        const req = http.request(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,isp,org`, {
            method: 'GET'
        }, (res) => {
            let body = "";

            res.on('error', (err) => {
                reject(err);
            });

            res.on('data', (chunk) => {
                body += chunk; // in case the body is huge it will sent in chunks not all at once
            });

            res.on('end', () => {
                let parsed_body;

                try {
                    parsed_body = JSON.parse(body);
                } catch (err) {
                    reject("Response from API was not valid JSON.");
                    return;
                }

                if (parsed_body.status !== "success") {
                    const message = parsed_body.message;

                    if (typeof message == 'string') {
                        reject(message);
                        return;
                    }

                    reject("Invalid response from API"); //Can only get here if either status is undefined or status is fail and there is no message, which are both invalid cases.
                    return;
                }

                delete parsed_body.status;

                const locateRes: GeoLocateRes = {
                    ip_address: ip,
                    ...parsed_body,
                    flag: getUnicodeFlagIcon(parsed_body.countryCode)
                }

                resolve(locateRes);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
}