import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import SearchPage from "@/pages/SearchPage";

const searchSpecies = vi.fn();
const getHotSearches = vi.fn();

vi.mock("@/services/species-service", () => ({
  searchSpecies: (...args: unknown[]) => searchSpecies(...args),
  getHotSearches: (...args: unknown[]) => getHotSearches(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth");
  return {
    ...actual,
    getStoredUser: () => ({ id: 7, nickname: "测试用户" }),
  };
});

describe("SearchPage discovery state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    getHotSearches.mockResolvedValue([
      { keyword: "绿叶蝉", count: 12 },
      { keyword: "稻纵卷叶螟", count: 9 },
    ]);
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

  it("loads hot searches and persists successful keywords into user-scoped history", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/search"]}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getHotSearches).toHaveBeenCalledWith(8));
    expect(screen.getAllByRole("button", { name: "绿叶蝉" }).length).toBe(1);

    fireEvent.change(screen.getByPlaceholderText("搜索昆虫物种"), {
      target: { value: "绿叶蝉" },
    });

    await waitFor(() => expect(searchSpecies).toHaveBeenCalledWith({ q: "绿叶蝉", page: 1, pageSize: 20 }));

    fireEvent.change(screen.getByPlaceholderText("搜索昆虫物种"), {
      target: { value: "" },
    });

    await waitFor(() => expect(screen.getAllByRole("button", { name: "绿叶蝉" }).length).toBe(2));
    expect(screen.getAllByRole("button", { name: "绿叶蝉" }).length).toBeGreaterThan(0);
    expect(localStorage.getItem("searchHistory:user:7")).toContain("绿叶蝉");
  });

  it("clears only local search history without affecting hot searches", async () => {
    localStorage.setItem("searchHistory:user:7", JSON.stringify(["绿叶蝉", "蝗总科"]));

    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/search"]}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getHotSearches).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: "清除" }));

    expect(localStorage.getItem("searchHistory:user:7")).toBe("[]");
    expect(screen.queryByText("蝗总科")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "稻纵卷叶螟" })).toBeInTheDocument();
  });
});
