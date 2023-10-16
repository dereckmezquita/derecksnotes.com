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


// when they register or changing the password they're always hashing it on the client with the fixed salt - using sha512
// they always hash it no matter on the client side
// we never get their password
// on the client we use a text decoder to get a textual representation of the hash's binary data
// when we use the subtle api it gives back an array buffer - we can't send this via json so we convert it to a textual representation
// we use the text decoder to do that - we use the text decoder with ascii so it's byte by byte and converts it into text
// it's baisically the same thing as doing a for loop over the array buffer and doing fromCharCode on each byte
// 