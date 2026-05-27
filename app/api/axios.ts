import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "https://idu-group-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("ACCESS_TOKEN");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData (let browser set boundary)
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData &&
      config.headers
    ) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ==============================
// PUBLIC PATHS (no redirect on 401)
// ==============================
const PUBLIC_PATHS = [
  "/",
  "/properties",
  "/about",
  "/contact",
  "/login",
  "/signup",
];

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestConfig = error.config as
      | (InternalAxiosRequestConfig & { skipAuthRedirect?: boolean })
      | undefined;
    const responseData = error.response?.data as
      | { needsProfileCompletion?: boolean }
      | undefined;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    // 401 — Unauthorized
    if (status === 401) {
      Cookies.remove("ACCESS_TOKEN");

      // DON'T redirect if on public pages
      const isPublicPage =
        PUBLIC_PATHS.includes(currentPath) ||
        currentPath.startsWith("/properties/");

      if (
        !requestConfig?.skipAuthRedirect &&
        !isPublicPage &&
        currentPath !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // 403 — Profile Completion Required
    if (status === 403 && responseData?.needsProfileCompletion === true) {
      if (currentPath !== "/profile/complete") {
        sessionStorage.setItem("redirectAfterProfile", currentPath);
        window.location.href = "/profile/complete";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
