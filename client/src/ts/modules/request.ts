
// submit a post request to getEntries express server
export const getEntries = async (section: string, pageSize: number): Promise<any> => {
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

export const getDefinitions = async (section: string, pageSize: number): Promise<any> => {
    const response = await fetch('/getDefinitions', {
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