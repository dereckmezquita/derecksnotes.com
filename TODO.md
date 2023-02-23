

1. Fix internal site links:

```html
From the results shown, which is the principal type of interaction between the linking site, and the accepting peptide? Table of amino acids found here <a href="/references/tables/displayEntry.php?entry=aminoAcids">amino acids chart</a>. State the ideal acceptor sequon.
```

2. Better way to bundle `mathjax` with `webpack`.

3. Configure nginx to rate limit - not express - because not all requests might go through expres

4. Use a third party API to geo locate the user from IP - we need to be able to explicityl control when a request get's made (on succesful registration) - there's no way to geo locate myself since we don't have a database

```ts
import { locateIP } from '../server/src/modules/ip_locate';

const ip_address: string = "75.80.232.56";

locateIP(ip_address).then((res) => {
    console.log(res);
});
```
