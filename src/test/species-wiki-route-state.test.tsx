import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import SpeciesWikiPage from "@/pages/SpeciesWikiPage";
import type { InsectInfo } from "@/types/api";

const getCurrentRecognition = vi.fn();
const getSpeciesDetail = vi.fn();

vi.mock("@/lib/recognition-session", () => ({
  getCurrentRecognition: () => getCurrentRecognition(),
}));

vi.mock("@/services/species-service", () => ({
  getSpeciesDetail: (...args: unknown[]) => getSpeciesDetail(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

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
  i18n: {
    orderName: { cn: "半翅目", en: "Hemiptera" },
    familyName: { cn: "叶蝉科", en: "Cicadellidae" },
    genusName: { cn: "叶蝉属", en: "Cicadella" },
    bodyLength: { cn: "待补充", en: "To be added." },
    distribution: { cn: "分布待补充", en: "Distribution pending." },
    activeSeason: { cn: "待补充", en: "To be added." },
    protectionLevel: { cn: "未评估", en: "Not evaluated" },
    description: { cn: "百科信息待补充。", en: "Profile pending." },
    morphology: { cn: "形态待补充。", en: "Morphology pending." },
    habits: { cn: "习性待补充。", en: "Habits pending." },
  },
};

describe("SpeciesWikiPage route state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentRecognition.mockReturnValue(null);
    getSpeciesDetail.mockResolvedValue(detail);
  });

  it("loads species detail from route state when there is no current recognition session", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/species-wiki", state: { speciesId: 69 } }]}> 
          <Routes>
            <Route path="/species-wiki" element={<SpeciesWikiPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getSpeciesDetail).toHaveBeenCalledWith(69));
    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());
  });
});
