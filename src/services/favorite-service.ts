import { request, withPagination } from "@/lib/api-client";
import type { FavoriteStatusResponse, InsectInfo, PageData } from "@/types/api";

export const listFavorites = ({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}) =>
  request<PageData<InsectInfo>>("/favorites", {
    params: {
      ...withPagination(page, pageSize),
    },
  });

export const getFavoriteStatus = (insectId: number) =>
  request<FavoriteStatusResponse>(`/favorites/${insectId}/status`);

export const toggleFavorite = (insectId: number) =>
  request<FavoriteStatusResponse>(`/favorites/${insectId}/toggle`, {
    method: "POST",
  });
