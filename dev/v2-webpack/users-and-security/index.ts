import argon2 from 'argon2';

const password = "myshitasspassword";

(async () => {
    console.time();

    const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        hashLength: 64
    });

    console.timeEnd();

    console.log(hash);
})();