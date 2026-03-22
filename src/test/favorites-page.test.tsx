import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import FavoritesPage from "@/pages/FavoritesPage";
import type { InsectInfo, PageData } from "@/types/api";

const listFavorites = vi.fn();

vi.mock("@/services/favorite-service", () => ({
  listFavorites: (...args: unknown[]) => listFavorites(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title, right }: { title?: string; right?: ReactNode }) => (
    <div>
      <div>{title}</div>
      {right}
    </div>
  ),
}));

const favoriteItem: InsectInfo = {
  id: 69,
  speciesNameCn: "绿叶蝉",
  speciesNameEn: "Cicadella viridis",
  orderName: "Hemiptera",
  orderNameCn: "半翅目",
  familyName: "Cicadellidae",
  familyNameCn: "叶蝉科",
  genusName: "Cicadella",
  genusNameCn: "叶蝉属",
  bodyLength: "待补充",
  bodyLengthEn: "To be added.",
  distribution: "分布待补充",
  distributionEn: "Distribution pending.",
  activeSeason: "待补充",
  activeSeasonEn: "To be added.",
  protectionLevel: "未评估",
  protectionLevelEn: "Not evaluated",
  harmLevel: 1,
  description: "百科信息待补充。",
  descriptionEn: "Profile pending.",
  morphology: "形态待补充。",
  morphologyEn: "Morphology pending.",
  habits: "习性待补充。",
  habitsEn: "Habits pending.",
  recognitionCount: 3,
  coverImageUrl: null,
  createdAt: null,
  updatedAt: null,
};

const favoritesPageData: PageData<InsectInfo> = {
  list: [favoriteItem],
  total: 1,
  page: 1,
  size: 20,
};

describe("FavoritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listFavorites.mockResolvedValue(favoritesPageData);
  });

  it("loads and renders favorite species from backend", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(listFavorites).toHaveBeenCalledWith({ page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());
  });
});
