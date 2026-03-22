import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import RecordDetailPage from "@/pages/RecordDetailPage";
import type { RecognitionResult } from "@/types/api";

const getRecognitionDetail = vi.fn();
const deleteRecognitionHistory = vi.fn();

vi.mock("@/services/recognition-service", () => ({
  getRecognitionDetail: (...args: unknown[]) => getRecognitionDetail(...args),
  deleteRecognitionHistory: (...args: unknown[]) => deleteRecognitionHistory(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
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

describe("RecordDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRecognitionDetail.mockResolvedValue(record);
    deleteRecognitionHistory.mockResolvedValue(undefined);
  });

  it("loads detail from backend and deletes the record", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/record-detail", state: { recognitionId: 21 } }]}>
          <Routes>
            <Route path="/record-detail" element={<RecordDetailPage />} />
            <Route path="/history" element={<div>history</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getRecognitionDetail).toHaveBeenCalledWith(21));
    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "删除记录" }));

    await waitFor(() => expect(deleteRecognitionHistory).toHaveBeenCalledWith(21));
  });
});
