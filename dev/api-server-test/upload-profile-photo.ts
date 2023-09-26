import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

const url: string = 'http://localhost:3001/api/';
const test_photo: string = path.join(__dirname, 'inputs/test-image.jpg');

async function main(): Promise<void> {
    const login = await axios.post(url + 'auth/login', {
        username: 'test',
        password: 'test',
    });

    const cookies = login.headers['set-cookie'];
    const cookieStr = cookies?.join('; ') ?? '';

    // Step 2: Upload a sample image to the profile_photo endpoint
    const formData = new FormData();
    formData.append('profileImage', fs.createReadStream(test_photo), 'sample.jpg');

    try {
        const uploadResponse = await axios.post(url + 'upload/profile_photo', formData, {
            headers: {
                ...formData.getHeaders(),
                Cookie: cookieStr
            }
        });

        console.log(uploadResponse.data);
    } catch (error: any) {
        console.log(error.response.data.message);
    }
}

main().catch(error => {
    console.error("Error testing profile_photo endpoint:", error);
});
