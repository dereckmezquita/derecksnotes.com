import axios from 'axios';

// we will send request to localhost:3001/api/hello
const url: string = 'http://localhost:3001/api/';

async function main(): Promise<void> {
    // ----------------------------------------
    const hello = await axios.get(url + 'hello');

    // response is a JSON object with a message property
    // console.log(hello.data);

    // ----------------------------------------
    const register = await axios.post(url + 'auth/register', {
        email: 'test@test.com',
        username: 'test',
        password: 'test',
    });

    // to drop just test user from mongo do this command:
    // db.users.deleteOne({ "username": "test" })

    console.log(register.data);

    // ----------------------------------------
    const login = await axios.post(url + 'auth/login', {
        username: 'test',
        password: 'test',
    });

    console.log(login.data);

    // Store the cookie to use for subsequent authenticated requests
    const cookies = login.headers['set-cookie'];
    // ----------------------------------------
    // Check user's details with /me endpoint
    const cookieStr = cookies?.join('; ') ?? '';

    const me = await axios.get(url + 'auth/me', {
        headers: {
            // Attach the session cookie to request headers
            Cookie: cookieStr
        }
    });

    console.log(me.data);
}

main();