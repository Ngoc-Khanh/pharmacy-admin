import { UserResponse } from "./user.interface";

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}
