(async () => {
    const encoder = new TextEncoder(); // used to convert the string to an array buffer - digest method requires an array buffer
    const decoder = new TextDecoder('ascii');
    const salt = "derecks-notes";
    const passBuff = encoder.encode("myshatpassword" + salt);

    // hash the password using sha512 from crypto.subtle
    const hashBuf = await crypto.subtle.digest("SHA-512", passBuff); // returns an array buffer

    const hashStr = decoder.decode(hashBuf); // We want to represent the binary hash data as a string, so that we can put it into a JSON string

    testy(hashStr);
})();

// ------------------------------------------------------------
// const encoder = new TextEncoder();
// const decoder = new TextDecoder();

// const salt = "some-hard-coded-salt"; // Hard-coded, never changes
// const pass = "myshitpassword";
// const passBuff = encoder.encode(`${pass}`); // Remember to add salt back

// console.time();
// crypto.subtle.digest('SHA-512', passBuff).then(hash => {
    
// });