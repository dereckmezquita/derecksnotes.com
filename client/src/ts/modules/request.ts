// TODO: update the way I get the webpage; use window.location instead
export const reqArticles = async (section: string, pageSize: number, nextToken?: string): Promise<ServerRes> => {
    const response = await fetch('/api/articles/get_metadata', {
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
    const response = await fetch('/api/dictionaries/get_definitions', {
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

export const register = async (firstName: string, lastName: string, username: string, email: string, password: string): Promise<ServerRes> => {
    const response = await fetch('/api/users/register', {
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
export const login = async (email: string, password: string): Promise<ServerRes> => {
    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    return await response.json() as ServerRes;
}

export const logout = async (): Promise<ServerRes> => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    return await response.json() as ServerRes;
}

export const resetPassword = async (email: string): Promise<ServerRes> => {
    const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email
        })
    });

    return await response.json() as ServerRes;
}

// ----------------------------------------
// the user should already be logged in for these functions; using their session token to identify
export const getUserInfo = async (): Promise<ServerRes<UserInfoRes>> => {
    const response = await fetch('/api/users/userinfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
  
    return await response.json() as ServerRes<UserInfoRes>;
}

export const sendComment = async (
    comment: string,
    datetime: string,
    replyToId?: string
): Promise<ServerRes> => {
    const article = window.location.pathname.split('/')[2];

    const response = await fetch('/api/articles/new_comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment: comment,
            datetime: datetime,
            article: article,
            replyToId: replyToId
        })
    });

    return await response.json() as ServerRes;
}

export const getComments = async (pageSize: number, nextToken?: string): Promise<ServerRes<UserCommentRes[]>> => {
    const article = window.location.pathname.split('/')[2];

    const response = await fetch('/api/articles/get_comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            article: article,
            pageSize: pageSize,
            nextToken: nextToken
        })
    });

    return await response.json() as ServerRes;
}

export const getAccontInfo = async (): Promise<ServerRes<UserInfo>> => {
    const response = await fetch('/api/users/account_info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    return await response.json() as ServerRes;
}