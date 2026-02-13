export const API_BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchJson<T>(
  pathOrUrl: string,
  init?: RequestInit
): Promise<T> {
  const url = pathOrUrl.startsWith('http') 
    ? pathOrUrl 
    : `${API_BASE_URL}${pathOrUrl}`;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch {
        // If error response isn't JSON, use status text
      }

      throw new ApiError(response.status, message, url);
    }

    const text = await response.text();
    
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new ApiError(
        500,
        'Invalid JSON response from server',
        url
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Preserve AbortError so callers can ignore it (e.g. on unmount / Strict Mode)
    if (error && typeof error === 'object' && (error as { name?: string }).name === 'AbortError') {
      throw error;
    }

    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Network error',
      url
    );
  }
}
