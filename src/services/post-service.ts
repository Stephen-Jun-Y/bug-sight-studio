import { request, withPagination } from "@/lib/api-client";
import type {
  CreatePostCommentPayload,
  CreatePostPayload,
  PageData,
  PostCommentItem,
  PostItem,
  PostListParams,
  TogglePostLikeResponse,
} from "@/types/api";

export const listPosts = ({ tab = "recommend", page = 1, pageSize = 20 }: PostListParams = {}) =>
  request<PageData<PostItem>>("/posts", {
    params: {
      tab,
      ...withPagination(page, pageSize),
    },
  });

export const getPostDetail = (postId: number) => request<PostItem>(`/posts/${postId}`);

export const togglePostLike = (postId: number) =>
  request<TogglePostLikeResponse>(`/posts/${postId}/like`, {
    method: "POST",
  });

export const listPostComments = (postId: number, { page = 1, pageSize = 20 } = {}) =>
  request<PageData<PostCommentItem>>(`/posts/${postId}/comments`, {
    params: {
      ...withPagination(page, pageSize),
    },
  });

export const createPostComment = (postId: number, payload: CreatePostCommentPayload) =>
  request<PostCommentItem>(`/posts/${postId}/comments`, {
    method: "POST",
    body: payload,
  });

export const createPost = (payload: CreatePostPayload, image?: File) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (image) {
    formData.append("image", image);
  }

  return request<PostItem>("/posts", {
    method: "POST",
    body: formData,
  });
};
