import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ScanPage from "@/pages/ScanPage";

describe("ScanPage layout", () => {
  it("uses safe-area aware top and bottom controls on the immersive camera screen", () => {
    const { container } = render(
      <MemoryRouter>
        <LanguageProvider>
          <ScanPage />
        </LanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("将昆虫置于取景框内")).toBeInTheDocument();

    const buttons = container.querySelectorAll("button");
    const topBackButton = buttons[0] as HTMLElement;
    expect(topBackButton.className).toContain("safe-top-anchor");
    expect(topBackButton.className).not.toContain("top-14");

    const bottomPanel = container.querySelector("div.absolute.bottom-0.glass-dark") as HTMLElement | null;
    expect(bottomPanel).not.toBeNull();
    expect(bottomPanel?.className).toContain("pb-safe-sheet");
  });
});
