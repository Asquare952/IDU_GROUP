import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const API_BASE_URL = "https://idu-group-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
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

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData &&
      config.headers
    ) {
      const headers = config.headers as Record<string, unknown> & {
        common?: Record<string, unknown>;
      };

      delete headers["Content-Type"];
      delete headers["content-type"];

      if (headers.common) {
        delete headers.common["Content-Type"];
        delete headers.common["content-type"];
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

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

    // 401 — Unauthorized (token expired/invalid)
    if (status === 401) {
      Cookies.remove("ACCESS_TOKEN");

      if (
        !requestConfig?.skipAuthRedirect &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    // 403 — Profile Completion Required
    if (status === 403 && responseData?.needsProfileCompletion === true) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/profile/complete") {
        sessionStorage.setItem("redirectAfterProfile", currentPath);
        window.location.href = "/profile/complete";
      }
    }

    return Promise.reject(error);
  },
);



export default api;
