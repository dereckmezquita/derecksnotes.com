// server side code
import * as argon2 from 'argon2';
import {createHash} from 'crypto';

// --------------------------------
// client side code
// --------------------------------+
// use a hard coded random value for a salt
// we are going to sha512 hash on the client side so that interceptor
const pass = "myshitpasswordd";
const passBuff = createHash('sha512').update(pass).digest();


// --------------------------------

const savedHash = '$argon2id$v=19$m=65536,t=3,p=1$/vbxHxa8p8gzPIDPSo2/Kw$3QDam5LPX/ekVXz/yNZBgOvaBuHvsvuYYFq8qa4UZbg';

// we receive their unhashed password for registration and hash it to save in our database?
// initial registration
// if we change parallelism etc we need to rehash all the passwords - migration
// we never actually get their password they send us a hash and we hash their hash and this is what we save
// santise user input especially character types encoding types
// (async () => {
//     console.time();
//     const bruh = await argon2.hash(passBuff, { type: argon2.argon2id, parallelism: 1 });
//     console.timeEnd();
//     console.log(bruh);
// })();

// login verification
(async () => {
    console.time();
    const bruh = await argon2.verify(savedHash, passBuff, {type: argon2.argon2id, parallelism: 1});
    console.timeEnd();
    console.log(bruh);
})();
// --------------------------------


// once the user is logged in make sure to set origin of the cookies so they can never be used on another site
