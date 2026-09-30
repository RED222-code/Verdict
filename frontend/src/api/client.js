// Requests to /api/v1/* are proxied to the Express backend:
// - locally:     via Vite's dev server proxy (vite.config.js)
// - on Vercel:   via the /api/(.*) rewrite in vercel.json
const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('verdict_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    throw new ApiError('Unable to connect to server. Please check your network or server status.', 0);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  let json = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (json && json.message) {
      errorMessage = json.message;
    } else if (response.status === 401) {
      errorMessage = 'Your session has expired or you are not signed in.';
    } else if (response.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (response.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (response.status >= 500) {
      errorMessage = 'Internal server error. Please try again shortly.';
    }

    throw new ApiError(errorMessage, response.status, json);
  }

  return json;
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
