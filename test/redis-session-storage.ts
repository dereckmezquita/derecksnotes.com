import { createClient } from 'redis';

// simply key value memory database store

// we can access this from cli: `redis-cli`
const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();

    const mykey = await client.get("mykey");

    console.log(`mykey: ${mykey}`);
})();

// we can set time limits on stores
// this is how session programs automatically get rid of sessions
