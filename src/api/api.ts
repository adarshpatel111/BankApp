// api.ts

const API_URL = process.env.EXPO_PUBLIC_BASE_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_BASE_URL is not defined. Check your .env file.");
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const url = `${API_URL}/auth${endpoint}`;
  console.log("REQUEST URL:", url);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API Error ${response.status}: ${errorText || response.statusText}`
    );
  }

  return response.json() as Promise<T>;
};

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T, B = unknown>(endpoint: string, body: B, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T, B = unknown>(endpoint: string, body: B, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;
