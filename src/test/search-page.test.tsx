import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import SearchPage from "@/pages/SearchPage";

const searchSpecies = vi.fn();

vi.mock("@/services/species-service", () => ({
  searchSpecies: (...args: unknown[]) => searchSpecies(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchSpecies.mockResolvedValue({
      list: [
        {
          id: 69,
          speciesNameCn: "绿叶蝉",
          speciesNameEn: "Cicadella viridis",
          orderName: "Hemiptera",
          familyName: "Cicadellidae",
          harmLevel: 1,
          recognitionCount: 0,
        },
      ],
      total: 1,
      page: 1,
      size: 20,
    });
  });

  it("loads backend species results when the user enters a keyword", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <SearchPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("搜索昆虫物种"), {
      target: { value: "绿叶蝉" },
    });

    await waitFor(() => expect(searchSpecies).toHaveBeenCalledWith({ q: "绿叶蝉", page: 1, pageSize: 20 }));
    await waitFor(() => expect(screen.getByText("绿叶蝉")).toBeInTheDocument());
  });
});
