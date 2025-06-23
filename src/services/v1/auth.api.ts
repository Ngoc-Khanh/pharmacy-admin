import { apiPost } from "@/services/api";

export const AuthAPI = {
  async fetchLogin(data: { email: string; password: string }) {
    return apiPost("/auth/login", data);
  }
}