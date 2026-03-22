import { request, withPagination } from "@/lib/api-client";
import type {
  ChangeCurrentUserPasswordRequest,
  CurrentUserProfile,
  FollowStatusResponse,
  InsectInfo,
  PageData,
  PostItem,
  PublicUserProfile,
  UpdateCurrentUserProfileRequest,
} from "@/types/api";

export const getCurrentUserProfile = () => request<CurrentUserProfile>("/users/me");

export const updateCurrentUserProfile = (payload: UpdateCurrentUserProfileRequest) =>
  request<CurrentUserProfile>("/users/me", {
    method: "PATCH",
    body: payload,
  });

export const changeCurrentUserPassword = (payload: ChangeCurrentUserPasswordRequest) =>
  request<{ success: boolean }>("/users/me/password", {
    method: "POST",
    body: payload,
  });

export const deleteCurrentUser = () =>
  request<{ success: boolean }>("/users/me", {
    method: "DELETE",
  });


export const getPublicUserProfile = (userId: number) =>
  request<PublicUserProfile>(`/users/${userId}/profile`);

export const listUserPosts = (userId: number, { page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}) =>
  request<PageData<PostItem>>(`/users/${userId}/posts`, {
    params: {
      ...withPagination(page, pageSize),
    },
  });

export const listUserFavorites = (userId: number, { page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}) =>
  request<PageData<InsectInfo>>(`/users/${userId}/favorites`, {
    params: {
      ...withPagination(page, pageSize),
    },
  });

export const getUserFollowStatus = (userId: number) =>
  request<FollowStatusResponse>(`/users/${userId}/follow-status`);

export const followUser = (userId: number) =>
  request<FollowStatusResponse>(`/users/${userId}/follow`, {
    method: "POST",
  });

export const unfollowUser = (userId: number) =>
  request<FollowStatusResponse>(`/users/${userId}/follow`, {
    method: "DELETE",
  });
