import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import UserProfilePage from "@/pages/UserProfilePage";

const getPublicUserProfile = vi.fn();
const listUserPosts = vi.fn();
const listUserFavorites = vi.fn();
const followUser = vi.fn();
const unfollowUser = vi.fn();

vi.mock("@/services/user-service", () => ({
  getPublicUserProfile: (...args: unknown[]) => getPublicUserProfile(...args),
  listUserPosts: (...args: unknown[]) => listUserPosts(...args),
  listUserFavorites: (...args: unknown[]) => listUserFavorites(...args),
  followUser: (...args: unknown[]) => followUser(...args),
  unfollowUser: (...args: unknown[]) => unfollowUser(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("UserProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    getPublicUserProfile.mockResolvedValue({
      id: 7,
      nickname: "昆虫猎人",
      bio: "常驻野外观察昆虫",
      avatarUrl: "",
      location: "",
      isFollowing: false,
      isSelf: false,
      recognitionCount: 328,
      postCount: 56,
      receivedLikeCount: 2100,
      favoriteCount: 12,
      followerCount: 89,
      followingCount: 24,
    });
    listUserPosts.mockResolvedValue({
      list: [
        {
          id: 12,
          userId: 7,
          content: "今天观察到一只绿叶蝉。",
          imageUrl: null,
          topicTags: "#昆虫",
          locationName: "上海",
          latitude: null,
          longitude: null,
          likeCount: 18,
          commentCount: 4,
          shareCount: 1,
          visibility: 1,
          likedByCurrentUser: false,
          createdAt: "2026-03-22T13:00:00",
          updatedAt: "2026-03-22T13:00:00",
        },
      ],
      total: 1,
      page: 1,
      size: 20,
    });
    listUserFavorites.mockResolvedValue({
      list: [
        {
          id: 70,
          speciesNameCn: "盲蝽科",
          speciesNameEn: "Miridae",
          orderName: "Hemiptera",
          familyName: "Miridae",
          genusName: "",
          harmLevel: 2,
          recognitionCount: 3,
          coverImageUrl: null,
        },
      ],
      total: 1,
      page: 1,
      size: 20,
    });
    followUser.mockResolvedValue({ isFollowing: true });
    unfollowUser.mockResolvedValue({ isFollowing: false });
  });

  it("loads profile, posts, and favorites using the route userId", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/user-profile/7"]}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfilePage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getPublicUserProfile).toHaveBeenCalledWith(7));
    await waitFor(() => expect(listUserPosts).toHaveBeenCalledWith(7, { page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("昆虫猎人")).toBeInTheDocument());
    expect(screen.getByText("常驻野外观察昆虫")).toBeInTheDocument();
    expect(screen.getByText("328")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
    expect(screen.getByText("2100")).toBeInTheDocument();
    expect(screen.getByText("今天观察到一只绿叶蝉。")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "收藏" }));
    await waitFor(() => expect(listUserFavorites).toHaveBeenCalledWith(7, { page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("盲蝽科")).toBeInTheDocument());
  });

  it("routes unauthenticated users to auth when they tap follow", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/user-profile/7"]}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfilePage />} />
            <Route path="/auth" element={<div>Auth Page</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("昆虫猎人")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "关注" }));

    await waitFor(() => expect(screen.getByText("Auth Page")).toBeInTheDocument());
  });

  it("toggles follow state for authenticated users", async () => {
    localStorage.setItem("accessToken", "token");

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/user-profile/7"]}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfilePage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("昆虫猎人")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "关注" }));

    await waitFor(() => expect(followUser).toHaveBeenCalledWith(7));
    await waitFor(() => expect(screen.getByRole("button", { name: "已关注" })).toBeInTheDocument());
  });
});
