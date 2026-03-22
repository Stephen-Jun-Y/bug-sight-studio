import type { ReactNode } from "react";
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ProfilePage from "@/pages/ProfilePage";
import type { CurrentUserProfile, PageData, RecognitionResult } from "@/types/api";

const navigateMock = vi.hoisted(() => vi.fn());
const clearAuthMock = vi.hoisted(() => vi.fn());
const getCurrentUserProfileMock = vi.hoisted(() => vi.fn());
const listRecognitionHistoryMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/lib/auth", () => ({
  clearAuth: clearAuthMock,
}));

vi.mock("@/services/user-service", () => ({
  getCurrentUserProfile: (...args: unknown[]) => getCurrentUserProfileMock(...args),
}));

vi.mock("@/services/recognition-service", () => ({
  listRecognitionHistory: (...args: unknown[]) => listRecognitionHistoryMock(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/TabBar", () => ({
  default: () => <div>TabBar</div>,
}));

const profile: CurrentUserProfile = {
  id: 7,
  nickname: "后端昵称",
  bio: "喜欢观察昆虫",
  location: "上海",
};

const history: PageData<RecognitionResult> = {
  list: [
    {
      recognitionId: 1,
      species: { id: 11, name: "绿叶蝉", latinName: "Cicadella viridis" },
      confidence: 0.91,
      similar: [],
      imageUrl: "http://example.com/1.jpg",
      location: "上海·世纪公园",
      capturedAt: "2026-03-22T09:20:00",
      note: null,
    },
    {
      recognitionId: 2,
      species: { id: 12, name: "中华稻蝗", latinName: "Oxya chinensis" },
      confidence: 0.88,
      similar: [],
      imageUrl: "http://example.com/2.jpg",
      location: "杭州·西溪湿地",
      capturedAt: "2026-03-23T12:10:00",
      note: null,
    },
    {
      recognitionId: 3,
      species: { id: 11, name: "绿叶蝉", latinName: "Cicadella viridis" },
      confidence: 0.85,
      similar: [],
      imageUrl: "http://example.com/3.jpg",
      location: "",
      capturedAt: "2026-03-23T18:10:00",
      note: null,
    },
  ],
  total: 3,
  page: 1,
  size: 100,
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentUserProfileMock.mockResolvedValue(profile);
    listRecognitionHistoryMock.mockResolvedValue(history);
  });

  it("loads profile, computes stats, and logs out", async () => {
    render(
      <LanguageProvider>
        <ProfilePage />
      </LanguageProvider>,
    );

    await waitFor(() => expect(getCurrentUserProfileMock).toHaveBeenCalled());
    await waitFor(() => expect(listRecognitionHistoryMock).toHaveBeenCalledWith({ page: 1, pageSize: 100 }));
    await waitFor(() => expect(screen.getByText("后端昵称")).toBeInTheDocument());

    expect(within(screen.getByText("物种").parentElement as HTMLElement).getByText("2")).toBeInTheDocument();
    expect(within(screen.getByText("地点").parentElement as HTMLElement).getByText("2")).toBeInTheDocument();
    expect(within(screen.getByText("天数").parentElement as HTMLElement).getByText("2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "退出登录" }));

    expect(clearAuthMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/auth", { replace: true });
  });
});
