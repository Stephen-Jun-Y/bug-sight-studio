import type { ReactNode } from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

describe("SearchPage filters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchSpecies.mockResolvedValue({ list: [], total: 0, page: 1, size: 20 });
  });

  it("applies harmLevel from the URL when searching", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/search?q=绿叶蝉&harmLevel=2"]}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(searchSpecies).toHaveBeenCalledWith({ q: "绿叶蝉", harmLevel: 2, page: 1, pageSize: 20 }));
  });
});
