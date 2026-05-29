import axios, { isAxiosError } from "axios";
import { isPublicAuthRequest } from "@/lib/auth-public-paths";
import { clearAuthSession, getStoredAccessToken } from "@/lib/auth-session";

/** Same pattern as `realtra-central-auth-frontend/src/lib/axios.ts`: default `/api` → Next rewrites to the real backend. */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const requestUrl = config.url ?? "";
  if (isPublicAuthRequest(requestUrl)) {
    return config;
  }
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      if (!isPublicAuthRequest(requestUrl)) {
        clearAuthSession();
      }
    }
    return Promise.reject(error);
  },
);
