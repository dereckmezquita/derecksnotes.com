
// submit a post request to getEntries express server
export const getEntries = async (section: string, pageSize: number, nextToken?: string): Promise<ServerRes> => {
    const response = await fetch('/api/getEntries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            section: section === 'index' ? 'blog' : section,
            pageSize: pageSize,
            nextToken: nextToken
        })
    });

    return await response.json() as ServerRes;
}

export const getDefinitions = async (dictionary: string, letter: string, pageSize: number, nextToken?: string): Promise<ServerRes> => {
    const response = await fetch('/api/getDefinitions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dictionary: dictionary,
            letter: letter,
            pageSize: pageSize,
            nextToken: nextToken
        })
    });

    return await response.json() as ServerRes;
}

export const register = async (username: string, email: string, password: string, firstName: string, lastName: string): Promise<ServerRes> => {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password,
            firstName,
            lastName
        })
    });

    return await response.json() as ServerRes;
}

// requires password hashed buffer to be converted to a textual representation
export const login = async (username: string, password: string): Promise<ServerRes> => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    return await response.json() as ServerRes;
}

// export const testy = async (data: string): Promise<ServerRes> => {
//     const response = await fetch('/api/testy', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: "testUser",
//             data: data
//         })
//     });

//     return await response.json() as ServerRes;
// }