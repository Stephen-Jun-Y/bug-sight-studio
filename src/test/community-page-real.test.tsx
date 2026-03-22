import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import CommunityPage from "@/pages/CommunityPage";

const listPosts = vi.fn();
const togglePostLike = vi.fn();

vi.mock("@/services/post-service", () => ({
  listPosts: (...args: unknown[]) => listPosts(...args),
  togglePostLike: (...args: unknown[]) => togglePostLike(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/TabBar", () => ({
  default: () => <div>TabBar</div>,
}));

vi.mock("@/components/ShareSheet", () => ({
  default: () => null,
}));

describe("CommunityPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listPosts.mockImplementation(async ({ tab }: { tab: string }) => ({
      list:
        tab === "following"
          ? []
          : [
              {
                id: 12,
                userId: 7,
                authorNickname: "虫野记录者",
                authorAvatarUrl: "https://example.com/avatar-7.jpg",
                content: "今天观察到一只绿叶蝉。",
                imageUrl: "https://example.com/post.jpg",
                topicTags: "#昆虫",
                locationName: "上海",
                latitude: null,
                longitude: null,
                likeCount: 18,
                commentCount: 4,
                shareCount: 1,
                visibility: 1,
                likedByCurrentUser: true,
                createdAt: "2026-03-22T13:00:00",
                updatedAt: "2026-03-22T13:00:00",
              },
            ],
      total: tab === "following" ? 0 : 1,
      page: 1,
      size: 20,
    }));
    togglePostLike.mockResolvedValue({ isLiked: false });
    localStorage.clear();
  });

  it("loads backend posts and switches tabs with backend tab keys", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <CommunityPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(listPosts).toHaveBeenCalledWith({ tab: "recommend", page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("今天观察到一只绿叶蝉。")).toBeInTheDocument());
    expect(screen.getByText("虫野记录者")).toBeInTheDocument();
    expect(screen.getByAltText("虫野记录者")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "最新" }));
    await waitFor(() => expect(listPosts).toHaveBeenCalledWith({ tab: "latest", page: 1, pageSize: 20 }));

    fireEvent.click(screen.getByRole("button", { name: "关注" }));
    await waitFor(() => expect(screen.getByText("登录后查看你关注的动态")).toBeInTheDocument());
    expect(listPosts).toHaveBeenCalledTimes(2);
  });

  it("hydrates liked state from backend before toggling likes", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <CommunityPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("今天观察到一只绿叶蝉。")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "取消点赞" }));

    await waitFor(() => expect(togglePostLike).toHaveBeenCalledWith(12));
    await waitFor(() => expect(screen.getByText("17")).toBeInTheDocument());
  });

  it("routes unauthenticated users to auth from following tab prompt", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/community"]}>
          <Routes>
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/auth" element={<div>Auth Page</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("今天观察到一只绿叶蝉。")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "关注" }));
    await waitFor(() => expect(screen.getByText("登录后查看你关注的动态")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "去登录" }));

    await waitFor(() => expect(screen.getByText("Auth Page")).toBeInTheDocument());
  });

  it("navigates to the author profile when the author area is tapped", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/community"]}>
          <Routes>
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/user-profile/:userId" element={<div>User Profile Page</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("今天观察到一只绿叶蝉。")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "查看 虫野记录者 的主页" }));

    await waitFor(() => expect(screen.getByText("User Profile Page")).toBeInTheDocument());
  });
});
