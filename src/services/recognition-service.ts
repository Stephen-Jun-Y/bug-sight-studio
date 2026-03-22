import { request, withPagination } from "@/lib/api-client";
import type { PageData, RecognitionResult, RecognitionUpdateRequest } from "@/types/api";

export const recognizeInsect = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return request<RecognitionResult>("/recognitions", {
    method: "POST",
    body: formData,
  });
};

export const listRecognitionHistory = ({
  page = 1,
  pageSize = 20,
  keyword,
}: {
  page?: number;
  pageSize?: number;
  keyword?: string;
} = {}) =>
  request<PageData<RecognitionResult>>("/recognitions", {
    params: {
      ...withPagination(page, pageSize),
      keyword,
    },
  });

export const getRecognitionDetail = (recognitionId: number) =>
  request<RecognitionResult>(`/recognitions/${recognitionId}`);

export const updateRecognitionHistory = (recognitionId: number, payload: RecognitionUpdateRequest) =>
  request<void>(`/recognitions/${recognitionId}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteRecognitionHistory = (recognitionId: number) =>
  request<void>(`/recognitions/${recognitionId}`, {
    method: "DELETE",
  });

export const batchDeleteRecognitionHistory = (ids: number[]) =>
  request<{ deletedCount: number }>("/history/batch", {
    method: "DELETE",
    body: { ids },
  });
