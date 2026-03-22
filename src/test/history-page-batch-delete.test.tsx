import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import HistoryPage from "@/pages/HistoryPage";
import type { PageData, RecognitionResult } from "@/types/api";

const listRecognitionHistory = vi.fn();
const batchDeleteRecognitionHistory = vi.fn();

vi.mock("@/services/recognition-service", () => ({
  listRecognitionHistory: (...args: unknown[]) => listRecognitionHistory(...args),
  batchDeleteRecognitionHistory: (...args: unknown[]) => batchDeleteRecognitionHistory(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/TabBar", () => ({
  default: () => <div>TabBar</div>,
}));

const records: RecognitionResult[] = [
  {
    recognitionId: 21,
    species: { id: 69, name: "绿叶蝉", latinName: "Cicadella viridis" },
    confidence: 0.913,
    similar: [],
    imageUrl: "http://127.0.0.1:8080/api/v1/files/21.jpg",
    location: "上海·世纪公园",
    note: "叶片上发现",
    capturedAt: "2026-03-22T09:20:00",
  },
  {
    recognitionId: 22,
    species: { id: 70, name: "盲蝽科", latinName: "Miridae" },
    confidence: 0.873,
    similar: [],
    imageUrl: "http://127.0.0.1:8080/api/v1/files/22.jpg",
    location: "杭州·西溪湿地",
    note: null,
    capturedAt: "2026-03-22T08:20:00",
  },
];

const pageData: PageData<RecognitionResult> = {
  list: records,
  total: 2,
  page: 1,
  size: 20,
};

describe("HistoryPage batch delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listRecognitionHistory.mockResolvedValue(pageData);
    batchDeleteRecognitionHistory.mockResolvedValue({ deletedCount: 2 });
  });

  it("batch deletes selected history records", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <HistoryPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "管理" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择记录 21" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "选择记录 22" }));
    fireEvent.click(screen.getByRole("button", { name: "删除已选" }));

    await waitFor(() => expect(batchDeleteRecognitionHistory).toHaveBeenCalledWith([21, 22]));
  });
});
