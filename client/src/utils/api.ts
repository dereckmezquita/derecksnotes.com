const BASE_URL = '/api/v1';

interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

class ApiError extends Error {
    constructor(
        public status: number,
        public data: any
    ) {
        super(data?.error || `API error ${status}`);
    }
}

async function request<T>(
    path: string,
    options: FetchOptions = {}
): Promise<T> {
    const { body, headers: customHeaders, ...rest } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((customHeaders as Record<string, string>) || {})
    };

    const config: RequestInit = {
        credentials: 'include',
        headers,
        ...rest
    };

    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, config);

    if (!response.ok) {
        const data = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(response.status, data);
    }

    return response.json();
}

export const api = {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'POST', body }),
    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'PATCH', body }),
    delete: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'DELETE', body })
};

export { ApiError };
