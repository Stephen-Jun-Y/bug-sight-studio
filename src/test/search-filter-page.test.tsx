import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import SearchFilterPage from "@/pages/SearchFilterPage";

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

const LocationEcho = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  return (
    <div>
      {location.pathname}|{params.get("q")}|{params.get("harmLevel")}
    </div>
  );
};

describe("SearchFilterPage", () => {
  it("writes the selected harmLevel back to the search page", () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/search-filter?q=蚜虫"]}>
          <Routes>
            <Route path="/search-filter" element={<SearchFilterPage />} />
            <Route path="/search" element={<LocationEcho />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "3级" }));
    fireEvent.click(screen.getByRole("button", { name: "应用筛选" }));

    expect(screen.getByText("/search|蚜虫|3")).toBeInTheDocument();
  });
});
