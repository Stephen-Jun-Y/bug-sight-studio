import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import PostDetailPage from "@/pages/PostDetailPage";

const getPostDetail = vi.fn();
const listPostComments = vi.fn();
const createPostComment = vi.fn();
const togglePostLike = vi.fn();

vi.mock("@/services/post-service", () => ({
  getPostDetail: (...args: unknown[]) => getPostDetail(...args),
  listPostComments: (...args: unknown[]) => listPostComments(...args),
  createPostComment: (...args: unknown[]) => createPostComment(...args),
  togglePostLike: (...args: unknown[]) => togglePostLike(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/components/ShareSheet", () => ({
  default: () => null,
}));

describe("PostDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPostDetail.mockResolvedValue({
      id: 21,
      userId: 8,
      authorNickname: "叶蝉观察员",
      authorAvatarUrl: "https://example.com/avatar-8.jpg",
      content: "今天在树叶上看到了叶蝉。",
      imageUrl: "https://example.com/post.jpg",
      topicTags: "#观察",
      locationName: "杭州",
      latitude: null,
      longitude: null,
      likeCount: 9,
      commentCount: 1,
      shareCount: 0,
      visibility: 1,
      likedByCurrentUser: true,
      createdAt: "2026-03-22T15:00:00",
      updatedAt: "2026-03-22T15:00:00",
    });
    listPostComments.mockResolvedValue({
      list: [
        {
          id: 31,
          postId: 21,
          userId: 5,
          authorNickname: "评论区伙伴",
          authorAvatarUrl: "https://example.com/avatar-5.jpg",
          parentId: null,
          content: "这只很清晰。",
          likeCount: 0,
          createdAt: "2026-03-22T15:10:00",
        },
      ],
      total: 1,
      page: 1,
      size: 20,
    });
    createPostComment.mockResolvedValue({
      id: 32,
      postId: 21,
      userId: 1,
      authorNickname: "新加入的观察者",
      authorAvatarUrl: "https://example.com/avatar-1.jpg",
      parentId: null,
      content: "新评论",
      likeCount: 0,
      createdAt: "2026-03-22T15:12:00",
    });
    togglePostLike.mockResolvedValue({ isLiked: false });
  });

  it("loads backend detail/comments and posts new comments", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/post-detail", state: { postId: 21 } }]}>
          <Routes>
            <Route path="/post-detail" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getPostDetail).toHaveBeenCalledWith(21));
    await waitFor(() => expect(listPostComments).toHaveBeenCalledWith(21, { page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("今天在树叶上看到了叶蝉。")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("这只很清晰。")).toBeInTheDocument());
    expect(screen.getByText("叶蝉观察员")).toBeInTheDocument();
    expect(screen.getByAltText("叶蝉观察员")).toBeInTheDocument();
    expect(screen.getByText("评论区伙伴")).toBeInTheDocument();
    expect(screen.getByAltText("评论区伙伴")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("写评论..."), {
      target: { value: "新评论" },
    });
    fireEvent.click(screen.getByRole("button", { name: "发送评论" }));

    await waitFor(() => expect(createPostComment).toHaveBeenCalledWith(21, { content: "新评论", parentId: null }));
    await waitFor(() => expect(screen.getByText("新评论")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("新加入的观察者")).toBeInTheDocument());
  });

  it("hydrates liked state from backend detail before toggling", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/post-detail", state: { postId: 21 } }]}>
          <Routes>
            <Route path="/post-detail" element={<PostDetailPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("9 赞")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "取消点赞" }));

    await waitFor(() => expect(togglePostLike).toHaveBeenCalledWith(21));
    await waitFor(() => expect(screen.getByText("8 赞")).toBeInTheDocument());
  });

  it("navigates to the author profile when the author area is tapped", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/post-detail", state: { postId: 21 } }]}>
          <Routes>
            <Route path="/post-detail" element={<PostDetailPage />} />
            <Route path="/user-profile/:userId" element={<div>User Profile Page</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("今天在树叶上看到了叶蝉。")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "查看 叶蝉观察员 的主页" }));

    await waitFor(() => expect(screen.getByText("User Profile Page")).toBeInTheDocument());
  });
});
