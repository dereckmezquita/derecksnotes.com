
import { locateIP } from '../server/src/modules/ip_locate';

const ip_address: string = "75.80.232.56";

locateIP(ip_address).then((res) => {
    console.log(res);
});
