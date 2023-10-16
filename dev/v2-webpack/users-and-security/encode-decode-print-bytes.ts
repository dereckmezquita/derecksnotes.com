import { TextEncoder, TextDecoder } from 'util'; // these are probably the same as the browser

// the purpose of this demo
// show the decoder part

const encoder = new TextEncoder();
const decoder = new TextDecoder('ascii');
const str = "bruh";

const encodedStr = encoder.encode(str); // this returns an array buffer
const decodedStr = decoder.decode(encodedStr);

console.log(decodedStr);

for (let i = 0; i < encodedStr.length; i++) {
    console.log(encodedStr[i]);
}
