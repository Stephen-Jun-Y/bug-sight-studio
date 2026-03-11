import { request } from "@/lib/api-client";
import type { AuthPayload, LoginRequest, RegisterRequest, UserProfile } from "@/types/api";

export const login = (payload: LoginRequest) => {
  return request<AuthPayload>("/auth/login", {
    method: "POST",
    body: payload,
  });
};

export const register = (payload: RegisterRequest) => {
  return request<AuthPayload>("/auth/register", {
    method: "POST",
    body: payload,
  });
};

export const getMe = () => request<UserProfile>("/users/me");

export const updateMe = (payload: Partial<UserProfile>) =>
  request<UserProfile>("/users/me", {
    method: "PATCH",
    body: payload,
  });

export const changePassword = (payload: { currentPassword: string; newPassword: string }) =>
  request<{ success: boolean }>("/users/me/password", {
    method: "POST",
    body: payload,
  });

export const deleteMe = () =>
  request<{ success: boolean }>("/users/me", {
    method: "DELETE",
  });
