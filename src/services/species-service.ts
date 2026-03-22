import { request, withPagination } from "@/lib/api-client";
import type { InsectInfo, PageData, SpeciesSearchParams } from "@/types/api";

export const getSpeciesDetail = (id: number) => request<InsectInfo>(`/species/${id}`);

export const getSimilarSpecies = (id: number) => request<InsectInfo[]>(`/species/${id}/similar`);

export const searchSpecies = ({ q, page = 1, pageSize = 20, harmLevel }: SpeciesSearchParams) =>
  request<PageData<InsectInfo>>("/species/search", {
    params: {
      q,
      harmLevel,
      ...withPagination(page, pageSize),
    },
  });
