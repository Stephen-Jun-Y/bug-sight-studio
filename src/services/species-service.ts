import { request, withPagination } from "@/lib/api-client";
import type { HotSearchItem, InsectInfo, PageData, SpeciesSearchParams } from "@/types/api";

export const getSpeciesDetail = (id: number) => request<InsectInfo>(`/species/${id}`);

export const getSimilarSpecies = (id: number) => request<InsectInfo[]>(`/species/${id}/similar`);

export const getPopularInsects = (limit = 6) =>
  request<InsectInfo[]>("/insects/popular", {
    params: { limit },
  });

export const searchSpecies = ({ q, page = 1, pageSize = 20, harmLevel }: SpeciesSearchParams) =>
  request<PageData<InsectInfo>>("/species/search", {
    params: {
      q,
      harmLevel,
      ...withPagination(page, pageSize),
    },
  });

export const getHotSearches = (limit = 8) =>
  request<HotSearchItem[]>("/species/hot-searches", {
    params: { limit },
  });
