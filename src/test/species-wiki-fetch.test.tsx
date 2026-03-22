import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
  id: 70,
  speciesNameCn: "盲蝽科",
  speciesNameEn: "Miridae",
  orderName: "Hemiptera",
  orderNameCn: "半翅目",
  familyName: "Miridae",
  familyNameCn: "盲蝽科",
  genusName: "To be added",
  genusNameCn: "待补充",
  bodyLength: "成虫常见 2-10 mm",
  bodyLengthEn: "Adults commonly range from 2-10 mm in length.",
  distribution: "广泛分布于农田、果园和自然植被环境中。",
  distributionEn: "Widely distributed in croplands, orchards, and natural vegetation.",
  activeSeason: "春末至秋季活跃",
  activeSeasonEn: "Most active from late spring to autumn.",
  protectionLevel: "未评估",
  protectionLevelEn: "Not evaluated",
  harmLevel: 1,
  description: "百科信息待补充。",
  descriptionEn: "Profile pending.",
  morphology: "形态特征待补充。",
  morphologyEn: "Morphology details are pending.",
  habits: "生活习性待补充。",
  habitsEn: "Habit details are pending.",
  recognitionCount: 0,
  coverImageUrl: null,
  createdAt: null,
  updatedAt: null,
  i18n: {
    orderName: { cn: "半翅目", en: "Hemiptera" },
    familyName: { cn: "盲蝽科", en: "Miridae" },
    genusName: { cn: "待补充", en: "To be added" },
    bodyLength: { cn: "成虫常见 2-10 mm", en: "Adults commonly range from 2-10 mm in length." },
    distribution: { cn: "广泛分布于农田、果园和自然植被环境中。", en: "Widely distributed in croplands, orchards, and natural vegetation." },
    activeSeason: { cn: "春末至秋季活跃", en: "Most active from late spring to autumn." },
    protectionLevel: { cn: "未评估", en: "Not evaluated" },
    description: { cn: "百科信息待补充。", en: "Profile pending." },
    morphology: { cn: "形态特征待补充。", en: "Morphology details are pending." },
    habits: { cn: "生活习性待补充。", en: "Habit details are pending." },
  },
};

describe("SpeciesWikiPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentRecognition.mockImplementation(() => ({
      recognition: {
        recognitionId: 1,
        species: {
          id: 70,
          name: "盲蝽科",
          latinName: "Miridae",
        },
        confidence: 0.91,
        similar: [],
        imageUrl: "http://127.0.0.1:8080/api/v1/files/demo.jpg",
        note: null,
        location: null,
        capturedAt: "2026-03-13T10:00:00",
      },
    }));
    getSpeciesDetail.mockResolvedValue(detail);
  });

  it("fetches species detail only once even after rerenders", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <SpeciesWikiPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("盲蝽科")).toBeInTheDocument());
    await waitFor(() => expect(getSpeciesDetail).toHaveBeenCalledTimes(1));
  });
});
