export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface AuthUser {
  id: number;
  nickname?: string;
  avatarUrl?: string;
}

export interface AuthPayload {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  userId?: number;
  nickname?: string;
  avatarUrl?: string;
  user?: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
  agreePolicy: boolean;
}

export interface UserProfile {
  id: number;
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
}
