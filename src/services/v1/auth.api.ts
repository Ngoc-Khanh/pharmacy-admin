import { LoginCredentials } from "@/data/dto";
import { AuthResponse, RefreshTokenResponse, UserResponse } from "@/data/interfaces";
import { SRO } from "@/data/sro";
import { apiGet, apiPost } from "@/services/api";

export const AuthAPI = {
  async fetchLogin(credentials: LoginCredentials) {
    const res = await apiPost<LoginCredentials, SRO<AuthResponse>>("v1/auth/credentials", credentials);
    return res.data.data;
  },

  async fetchUserInfo() {
    const res = await apiGet<SRO<UserResponse>>("/v1/auth/me");
    return res.data.data;
  },

  async refreshTokenUser() {
    const res = await apiPost<Record<string, never>, SRO<RefreshTokenResponse>>("v1/auth/refresh-token", {});
    return res.data.data;
  }
};
