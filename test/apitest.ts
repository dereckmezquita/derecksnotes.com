
import axios from 'axios';

(async () => {
    const res = (await axios.post('http://127.0.0.1:3000/getEntries', { section: 'blog' })).data;

    if (!res.success) return console.log(res.error);

    const entries = res.data.entries;
    const nextToken = res.data.nextToken;
    const entriesCount = entries.length;

    const res2 = (await axios.post('http://127.0.0.1:3000/getEntries', { section: 'blog', nextToken: nextToken })).data;

    if (!res2.success) return console.log(res2.error);

    const entries2 = res2.data.entries;
    const entriesCount2 = entries2.length;

    console.log(nextToken);
    console.log(entries[0].articleTitle);
    console.log(entries[entriesCount - 1].articleTitle);
    console.log();
    console.log(entries2[0].articleTitle);
    console.log(entries2[entriesCount2 - 1].articleTitle);
})().catch(err => {
    console.error(err);
});
