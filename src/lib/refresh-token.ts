import { routes, siteConfig } from "@/config";
import { AuthAPI } from "@/services/v1";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

export const refreshTokenHandler = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }
  isRefreshing = true;
  try {
    const res = await AuthAPI.refreshTokenUser();
    const newToken = res.accessToken;
    localStorage.setItem(siteConfig.auth.jwt_key, newToken);
    processQueue(null, newToken);
    if (import.meta.env.DEV) console.log("Token refreshed successfully");
    return newToken;
  } catch (error) {
    if (import.meta.env.DEV) console.log("Refresh token failed:", error);
    processQueue(error as Error);
    window.location.href = routes.auth.login;
    throw error;
  } finally {
    isRefreshing = false;
  }
};