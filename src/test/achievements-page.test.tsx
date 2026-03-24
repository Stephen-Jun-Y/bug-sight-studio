import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import AchievementsPage from "@/pages/AchievementsPage";

const getMyAchievementsMock = vi.hoisted(() => vi.fn());

vi.mock("@/services/user-service", () => ({
  getMyAchievements: (...args: unknown[]) => getMyAchievementsMock(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("AchievementsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyAchievementsMock.mockResolvedValue({
      unlockedCount: 1,
      totalCount: 2,
      items: [
        {
          id: 1,
          name: "初次探索",
          description: "完成第一次昆虫识别",
          icon: "🔍",
          conditionType: "recognition_count",
          targetValue: 1,
          currentValue: 1,
          progressPercent: 100,
          unlocked: true,
          unlockedAt: "2026-03-23T08:00:00",
        },
        {
          id: 2,
          name: "探索者",
          description: "在3个不同地点观察昆虫",
          icon: "📍",
          conditionType: "location_count",
          targetValue: 3,
          currentValue: 2,
          progressPercent: 67,
          unlocked: false,
          unlockedAt: null,
        },
      ],
    });
  });

  it("renders unlocked count and badge progress from the backend", async () => {
    render(
      <LanguageProvider>
        <AchievementsPage />
      </LanguageProvider>,
    );

    await waitFor(() => expect(getMyAchievementsMock).toHaveBeenCalled());
    expect(screen.getByText("已解锁 1/2 个徽章")).toBeInTheDocument();
    expect(screen.getByText("初次探索")).toBeInTheDocument();
    expect(screen.getByText("探索者")).toBeInTheDocument();
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });
});
