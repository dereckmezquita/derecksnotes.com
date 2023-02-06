export async function pass2HashText(password: string, salt: string, algorithm: string = "SHA-512"): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("ascii");

    const passBuff: ArrayBuffer = encoder.encode(password + salt).buffer;

    // hash the password using sh512 from crypto.subtle
    // this is simply so we never send the password in plain text
    // the password is re-salted and hashed on the server
    const hashBuff: ArrayBuffer = await crypto.subtle.digest(algorithm, passBuff);

    // we want a textual representation of the binary hash so we can send it in JSON
    return decoder.decode(hashBuff);
}