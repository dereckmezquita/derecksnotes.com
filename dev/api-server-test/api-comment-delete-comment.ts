import axios from 'axios';

// we will send request to localhost:3001/api/hello
const url: string = 'http://localhost:3001/api/v3/';

async function main(): Promise<void> {
    // ----------------------------------------
    const hello = await axios.get(url + 'hello');

    // response is a JSON object with a message property
    // console.log(hello.data);

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

    let comment;
    try {
        comment = await axios.post(
            url + 'interact/new_comment',
            {
                comment: "test",
                slug: "chemistry_general-chemistry_a_acid"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookieStr
                }
            }
        );
    } catch (error) {
        console.error(error);
    }

    if (!comment) return;

    try {
        // end point expects an array of comment ids
        const deleted_comment = await axios.delete(
            url + 'interact/delete_comments',
            {
                data: {
                    commentIds: [comment.data.id]
                },
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookieStr
                }
            }
        )
        console.log(deleted_comment.data);
    } catch (error) {
        console.error(error);
    }
}

main();