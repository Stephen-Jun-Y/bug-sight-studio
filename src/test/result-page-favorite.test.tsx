import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ResultPage from "@/pages/ResultPage";
import type { InsectInfo, RecognitionResult } from "@/types/api";

const useCurrentRecognition = vi.fn();
const getSpeciesDetail = vi.fn();
const getFavoriteStatus = vi.fn();
const toggleFavorite = vi.fn();

vi.mock("@/lib/use-current-recognition", () => ({
  useCurrentRecognition: (...args: unknown[]) => useCurrentRecognition(...args),
}));

vi.mock("@/services/species-service", () => ({
  getSpeciesDetail: (...args: unknown[]) => getSpeciesDetail(...args),
}));

vi.mock("@/services/favorite-service", () => ({
  getFavoriteStatus: (...args: unknown[]) => getFavoriteStatus(...args),
  toggleFavorite: (...args: unknown[]) => toggleFavorite(...args),
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

const recognition: RecognitionResult = {
  recognitionId: 12,
  species: { id: 69, name: "绿叶蝉", latinName: "Cicadella viridis" },
  confidence: 0.913,
  similar: [],
  imageUrl: "http://127.0.0.1:8080/api/v1/files/test.jpg",
  capturedAt: "2026-03-22T10:00:00",
};

const detail: InsectInfo = {
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
  recognitionCount: 0,
  coverImageUrl: null,
  createdAt: null,
  updatedAt: null,
};

describe("ResultPage favorites", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCurrentRecognition.mockReturnValue(recognition);
    getSpeciesDetail.mockResolvedValue(detail);
    getFavoriteStatus.mockResolvedValue({ isFavorited: false });
    toggleFavorite.mockResolvedValue({ isFavorited: true });
  });

  it("loads favorite status and toggles favorite from the result page", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/result", state: { recognition } }]}>
          <Routes>
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getFavoriteStatus).toHaveBeenCalledWith(69));

    fireEvent.click(screen.getByRole("button", { name: "收藏" }));

    await waitFor(() => expect(toggleFavorite).toHaveBeenCalledWith(69));
  });
});
