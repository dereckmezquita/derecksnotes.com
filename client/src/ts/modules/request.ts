const api_target: string = 'api2';

// TODO: update the way I get the webpage; use window.location instead
export const reqArticles = async (section: string, pageSize: number, nextToken?: string): Promise<ServerRes> => {
    const response = await fetch(`/${api_target}/articles/get_articles`, {
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
    const response = await fetch(`/${api_target}/dictionaries/get_definitions`, {
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

export const register = async (firstName: string, lastName: string, username: string, email: string, password: string): Promise<ServerRes<RegisterMessage>> => {
    const response = await fetch(`/${api_target}/users/register`, {
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
        } as RegisterMessage)
    });

    return await response.json() as ServerRes;
}

// requires password hashed buffer to be converted to a textual representation
export const login = async (email: string, password: string): Promise<ServerRes> => {
    const response = await fetch(`/${api_target}/users/login`, {
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
    const response = await fetch(`/${api_target}/users/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    return await response.json() as ServerRes;
}

export const resetPassword = async (email: string): Promise<ServerRes> => {
    const response = await fetch(`/${api_target}/resetPassword`, {
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
export const getUserInfo = async (): Promise<ServerRes<UserInfo>> => {
    const response = await fetch(`/${api_target}/users/get_user_info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
  
    return await response.json() as ServerRes<UserInfo>;
}

export const sendComment = async (
    comment: string,
    datetime: string,
    mentions: string[],
    replyToId?: string
): Promise<ServerRes> => {
    const article = window.location.pathname.split('/')[2];

    const response = await fetch(`/${api_target}/articles/new_comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment: comment,
            datetime: datetime,
            article: article,
            mentions: mentions,
            replyToId: replyToId
        })
    });

    return await response.json() as ServerRes;
}

export const getComments = async (pageSize: number, nextToken?: string): Promise<ServerRes<UserComment[]>> => {
    const article = window.location.pathname.split('/')[2];

    const response = await fetch(`/${api_target}/articles/get_comments`, {
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

export const getCommentReplies = async (commentId: string, pageSize: number, nextToken?: string): Promise<ServerRes<UserComment[]>> => {
    const response = await fetch(`/${api_target}/articles/get_comment_replies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commentId: commentId,
            pageSize: pageSize,
            nextToken: nextToken
        })
    });

    return await response.json() as ServerRes;
}

export const judgeComment = async (commentId: string, vote: "like" | "dislike"): Promise<ServerRes> => {
    const response = await fetch(`/${api_target}/articles/judge_comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commentId: commentId,
            vote: vote
        })
    });

    return await response.json() as ServerRes;
}

export const reportComment = async (
    commentId: string,
    datetime: string
): Promise<ServerRes> => {
    const article = window.location.pathname.split('/')[2];

    const response = await fetch(`/${api_target}/articles/report_comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            commentId: commentId,
            datetime: datetime,
            article: article
        })
    });

    return await response.json() as ServerRes;
}

export const getAccontInfo = async (): Promise<ServerRes<UserInfo>> => {
    const response = await fetch(`/${api_target}/users/account_info`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    return await response.json() as ServerRes;
}