import { toast } from 'sonner';

const BASE_URL = '/api/v1';

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  silent?: boolean; // suppress error toasts
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
  const { body, headers: customHeaders, silent, ...rest } = options;

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
    const error = new ApiError(response.status, data);

    // Show toast for server errors (not auth errors — those are handled by AuthContext)
    // Never expose raw server error messages — use safe generic messages
    if (!silent && response.status !== 401) {
      if (response.status === 429) {
        toast.error('Too many requests. Please slow down.');
      } else if (response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (response.status === 403) {
        toast.error('You do not have permission to do that.');
      }
    }

    throw error;
  }

  return response.json();
}

export const api = {
  get: <T>(path: string, opts?: { silent?: boolean }) =>
    request<T>(path, { method: 'GET', ...opts }),
  post: <T>(path: string, body?: unknown, opts?: { silent?: boolean }) =>
    request<T>(path, { method: 'POST', body, ...opts }),
  patch: <T>(path: string, body?: unknown, opts?: { silent?: boolean }) =>
    request<T>(path, { method: 'PATCH', body, ...opts }),
  delete: <T>(path: string, body?: unknown, opts?: { silent?: boolean }) =>
    request<T>(path, { method: 'DELETE', body, ...opts })
};

export { ApiError };
