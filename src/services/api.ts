import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { routes, siteConfig } from "@/config";
import { getLocale } from "@/lib/get-locales";
import { getAccessToken } from "@/lib/get-token";
import { toCamelCase } from "@/lib/to-camel-case";
import { toSnakeCase } from "@/lib/to-snake-case";
import { refreshTokenHandler } from "@/lib/refresh-token";

// Create an Axios instance
const api = axios.create({
  baseURL: siteConfig.backend.base_api_url, // Replace with your API base URL
  headers: siteConfig.backend.base_headers,
});

const aiApi = axios.create({
  baseURL: siteConfig.backend.llm_ai_url,
  headers: siteConfig.backend.base_headers,
});

// Thêm request interceptor để bao gồm JWT token trong headers
api.interceptors.request.use(
  async (config) => {
    const [token, locale] = await Promise.all([getAccessToken(), getLocale()]);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Accept-Language"] = locale;
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm response interceptor (tùy chọn, để xử lý lỗi hoặc các phản hồi cụ thể toàn cục)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      // Nếu là lỗi 401 và chưa retry
      if (originalRequest.url?.includes("auth/refresh-token")) {
        localStorage.removeItem(siteConfig.auth.jwt_key);
        window.location.href = routes.auth.login;
        return Promise.reject(error);
      }
      if (!originalRequest.url?.includes("auth/credentials")) {
        // Nếu không phải là request refresh token
        originalRequest._retry = true;
        try {
          const newToken = await refreshTokenHandler();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh thất bại, đã được xử lý trong refreshTokenHandler
          return Promise.reject(refreshError);
        }
      } else {
        // Đối với login endpoint bị 401, chuyển về login
        window.location.href = routes.auth.login;
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor để convert response từ snake_case -> camelCase
[api, aiApi].forEach((instance) => {
  instance.interceptors.response.use((response) => {
    if (response.data) response.data = toCamelCase(response.data);
    return response;
  });
});

// Interceptor để convert request từ camelCase -> snake_case
[api, aiApi].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    // Không convert FormData để tránh làm hỏng multipart/form-data
    if (config.data && !(config.data instanceof FormData)) {
      config.data = toSnakeCase(config.data);
    }
    return config;
  });
});

export const apiGet = async <ResponseData = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => api.get<ResponseData>(url, config);

export const aiApiGet = async <ResponseData = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => aiApi.get<ResponseData>(url, config);

export const aiApiPost = async <PostData = unknown, ResponseData = unknown>(
  url: string,
  data: PostData,
  config?: AxiosRequestConfig
) => aiApi.post<ResponseData, AxiosResponse<ResponseData>>(url, data, config);

export const apiPost = async <PostData = unknown, ResponseData = unknown>(
  url: string,
  data: PostData,
  config?: AxiosRequestConfig
) => api.post<ResponseData, AxiosResponse<ResponseData>>(url, data, config);

export const apiPut = async <PutData = unknown, ResponseData = unknown>(
  url: string,
  data: PutData,
  config?: AxiosRequestConfig
) => api.put<ResponseData, AxiosResponse<ResponseData>>(url, data, config);

export const apiPatch = async <PatchData = unknown, ResponseData = unknown>(
  url: string,
  data: PatchData,
  config?: AxiosRequestConfig
) => api.patch<ResponseData, AxiosResponse<ResponseData>>(url, data, config);

export const apiDelete = async <ResponseData = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => api.delete<ResponseData>(url, config);

export default api;
