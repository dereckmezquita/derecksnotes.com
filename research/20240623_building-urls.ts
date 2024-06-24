import url from 'url';

const urlObject = {
    protocol: 'http',
    hostname: 'localhost',
    port: 3000,
    pathname: '/pathname',
    query: { search: 'test' },
    hash: '#hash'
};

// Construct the URL
const myUrl1 = url.format(urlObject);

console.log(myUrl1);

// and using node's URL
const myUrl2 = new URL('pathname', 'http://localhost:3000');

console.log(myUrl2.toString());

// using the imported URL
import { URL as URL2 } from 'url';

const myUrl3 = new URL2('pathname', 'http://localhost:3000');

console.log(myUrl3.toString());