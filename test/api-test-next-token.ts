
import axios from 'axios';

(async () => {
    const res = (await axios.post('http://127.0.0.1:3000/getDefinitions', {
        dictionary: 'biology',
        letter: "a",
        pageSize: 10,
        nextToken: "6339bccefccbef87344cbabc"
    })).data;

    if (!res.success) return console.log(res.error);
    
    console.log(res.data.nextToken);
})().catch(err => {
    console.error(err);
});
