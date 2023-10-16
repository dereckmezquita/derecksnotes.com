import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();

    // Setting a value for 'mykey'
    await client.set("mykey", "Hello, Redis!");

    const mykey = await client.get("mykey");

    console.log(`mykey: ${mykey}`);
    
    // Optional: Disconnect after testing
    await client.quit();
})();
