import geoip from 'geoip-lite';
import countryLookup from 'country-code-lookup';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

export default function geoLocate(ip: string): GeolocationDTO {
    try {
        const geo = geoip.lookup(ip);

        // or if local ip
        if (!geo || ip === '::1' || ip === '') {
            throw new Error('Invalid IP address');
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
            country: 'Antarctica',
            countryCode: 'AQ',
            flag: '🇦🇶',
            regionName: 'Ross Dependency',
            city: 'McMurdo Station'
        };
    }
}
