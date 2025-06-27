import { UserResponse } from "./user.interface";

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}