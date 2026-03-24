import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import HomePage from "@/pages/HomePage";
import type { HomeFeedData } from "@/types/api";

const navigateMock = vi.hoisted(() => vi.fn());
const getHomeFeedMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/services/home-feed-service", () => ({
  getHomeFeed: (...args: unknown[]) => getHomeFeedMock(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/TabBar", () => ({
  default: () => <div>TabBar</div>,
}));

const homeFeed: HomeFeedData = {
  recentItems: [
    {
      id: "recent-1",
      imageUrl: "https://example.com/mantis.jpg",
      speciesNameCn: "中华螳螂",
      speciesNameEn: "Chinese mantis",
      capturedLabelCn: "2 小时前",
      capturedLabelEn: "2h ago",
    },
  ],
  popularItems: [
    {
      id: "popular-1",
      imageUrl: "https://example.com/butterfly.jpg",
      speciesNameCn: "帝王蝶",
      speciesNameEn: "Monarch butterfly",
      recognitionLabelCn: "1,234 次识别",
      recognitionLabelEn: "1,234 recognitions",
    },
  ],
};

describe("HomePage feed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getHomeFeedMock.mockResolvedValue(homeFeed);
  });

  it("loads recent scans and popular discoveries from the home feed service", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getHomeFeedMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText("中华螳螂")).toBeInTheDocument());
    expect(screen.getByText("2 小时前")).toBeInTheDocument();
    expect(screen.getByText("帝王蝶")).toBeInTheDocument();
    expect(screen.getByText("1,234 次识别")).toBeInTheDocument();
  });
});
