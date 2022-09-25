

type Entry = {
    title: string,
    date: string,
    content: string
}

type EntrisResponse = {
    entries: Entry[];
}

// print the name of the html file to the console
let file: string = window.location.pathname;
// remove extension
file = file.substring(0, file.lastIndexOf('.'));
// remove leading slash
file = file.substring(1);

// submit a post request to getEntries express server
const getEntries = async (section: string, numEntries: number): Promise<any> => {
    const response = await fetch('/getEntries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            section: section === 'index' ? 'blog' : section,
            numEntries: numEntries
        })
    });

    return await response.json();
}

// get entries as promise await
(async () => {
    const res = await getEntries(file, 10);

    console.log(res.data.entries[0]);
})();
