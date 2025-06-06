import Cookies from "js-cookie";
import { toast } from "sonner";

const BASE_URL = "http://localhost:8000/api";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

type RequestConfig = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

const getAuthToken = () => Cookies.get("auth_token");
// console.log('Auth Token:', getAuthToken);

// Request Interceptor
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return {
    ...config,
    headers,
  };
};

// Response Interceptor
const responseInterceptor = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  if (!response.status) {
    const error = new Error(data.message || "Request failed");
    Object.assign(error, {
      status: response.status,
      errors: data.errors,
    });
    throw error;
  }

  if (data.data === undefined) {
    throw new Error(data.message || "No data received from API");
  }

  return data.data;
};

// Error Interceptor
const errorInterceptor = (error: unknown): never => {
  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  } else {
    throw new Error("Unknown API error");
  }
};

// Main API Client
export const apiClient = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  try {
    const interceptedConfig = requestInterceptor(config);
    const response = await fetch(`${BASE_URL}${endpoint}`, interceptedConfig);
    console.log(`Request to ${BASE_URL}${endpoint} with config:`, interceptedConfig);

    return await responseInterceptor<T>(response);
  } catch (error) {
    return errorInterceptor(error);
  }
};

// Helper Methods
export const get = <T>(endpoint: string, config?: RequestConfig) =>
  apiClient<T>(endpoint, { ...config, method: "GET" });

export const post = <T>(endpoint: string, body: any, config?: RequestConfig) =>
  apiClient<T>(endpoint, {
    ...config,
    method: "POST",
    body: JSON.stringify(body),
  });

export const put = <T>(endpoint: string, body: any, config?: RequestConfig) =>
  apiClient<T>(endpoint, {
    ...config,
    method: "PUT",
    body: JSON.stringify(body),
  });

export const del = <T>(endpoint: string, config?: RequestConfig) =>
  apiClient<T>(endpoint, { ...config, method: "DELETE" });


export const setAuthToken = (token: string) => {
  Cookies.set("auth_token", token, {
    expires: 7,
    path: "/",
    sameSite: "Lax",
    secure: false,
  });
};

