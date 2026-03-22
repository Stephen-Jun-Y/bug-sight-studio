import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import HistoryPage from "@/pages/HistoryPage";
import type { PageData, RecognitionResult } from "@/types/api";

const listRecognitionHistory = vi.fn();

vi.mock("@/services/recognition-service", () => ({
  listRecognitionHistory: (...args: unknown[]) => listRecognitionHistory(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/TabBar", () => ({
  default: () => <div>TabBar</div>,
}));

const record: RecognitionResult = {
  recognitionId: 21,
  species: { id: 69, name: "绿叶蝉", latinName: "Cicadella viridis" },
  confidence: 0.913,
  similar: [],
  imageUrl: "http://127.0.0.1:8080/api/v1/files/21.jpg",
  location: "上海·世纪公园",
  note: "叶片上发现",
  capturedAt: "2026-03-22T09:20:00",
};

const historyPageData: PageData<RecognitionResult> = {
  list: [record],
  total: 1,
  page: 1,
  size: 20,
};

describe("HistoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listRecognitionHistory.mockResolvedValue(historyPageData);
  });

  it("loads and renders history records from backend", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <HistoryPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(listRecognitionHistory).toHaveBeenCalledWith({ page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());
  });
});
