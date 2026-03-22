import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import EditRecordPage from "@/pages/EditRecordPage";
import type { RecognitionResult } from "@/types/api";

const getRecognitionDetail = vi.fn();
const updateRecognitionHistory = vi.fn();

vi.mock("@/services/recognition-service", () => ({
  getRecognitionDetail: (...args: unknown[]) => getRecognitionDetail(...args),
  updateRecognitionHistory: (...args: unknown[]) => updateRecognitionHistory(...args),
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

describe("EditRecordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRecognitionDetail.mockResolvedValue(record);
    updateRecognitionHistory.mockResolvedValue(undefined);
  });

  it("loads the record and submits the updated note and location", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={[{ pathname: "/edit-record", state: { recognitionId: 21 } }]}>
          <Routes>
            <Route path="/edit-record" element={<EditRecordPage />} />
            <Route path="/record-detail" element={<div>detail</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getRecognitionDetail).toHaveBeenCalledWith(21));

    fireEvent.change(screen.getByLabelText("备注"), { target: { value: "改成新的备注" } });
    fireEvent.change(screen.getByLabelText("地点"), { target: { value: "杭州·西溪湿地" } });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => expect(updateRecognitionHistory).toHaveBeenCalledWith(21, {
      note: "改成新的备注",
      locationName: "杭州·西溪湿地",
    }));
  });
});
