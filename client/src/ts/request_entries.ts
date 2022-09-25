
const siteSection: string = (document.getElementById("siteSection") as HTMLInputElement).value;

// submit a post request to getEntries express server
const getEntries = async (section: string, pageSize: number): Promise<any> => {
    const response = await fetch('/getEntries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            section: section === 'index' ? 'blog' : section,
            pageSize: pageSize
        })
    });

    return await response.json();
}

// get entries as promise await
(async () => {
    const res = await getEntries(siteSection, 10);

    console.log(res.data);
})();
