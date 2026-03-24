import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ResultPage from "@/pages/ResultPage";
import type { RecognitionResult } from "@/types/api";

const useCurrentRecognition = vi.fn();
const getSpeciesDetail = vi.fn();
const getFavoriteStatus = vi.fn();

vi.mock("@/lib/use-current-recognition", () => ({
  useCurrentRecognition: (...args: unknown[]) => useCurrentRecognition(...args),
}));

vi.mock("@/services/species-service", () => ({
  getSpeciesDetail: (...args: unknown[]) => getSpeciesDetail(...args),
}));

vi.mock("@/services/favorite-service", () => ({
  getFavoriteStatus: (...args: unknown[]) => getFavoriteStatus(...args),
  toggleFavorite: vi.fn(),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

const unknownRecognition: RecognitionResult = {
  recognitionId: 88,
  species: null,
  confidence: 0.41,
  similar: [],
  imageUrl: "http://example.com/files/floor.jpg",
  capturedAt: "2026-03-22T10:00:00",
  isUnknown: true,
};

describe("ResultPage unknown state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCurrentRecognition.mockReturnValue(unknownRecognition);
    getFavoriteStatus.mockResolvedValue({ isFavorited: false });
    getSpeciesDetail.mockRejectedValue(new Error("unknown"));
  });

  it("renders unknown-result copy without wiki or similar entry points", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/result", state: { recognition: unknownRecognition } }]}>
          <Routes>
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    expect(screen.getByText("未识别到昆虫，请重新拍摄或更换角度")).toBeInTheDocument();
    expect(screen.queryByText("相似物种")).not.toBeInTheDocument();
    expect(screen.queryByText("百科介绍")).not.toBeInTheDocument();
  });
});
