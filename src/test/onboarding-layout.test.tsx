import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language";
import OnboardingPage from "@/pages/OnboardingPage";

describe("OnboardingPage layout", () => {
  it("uses safe-area aware top and bottom layout for immersive controls", () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <OnboardingPage />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const skipButton = screen.getByRole("button", { name: "跳过" });
    expect(skipButton.className).toContain("safe-top-anchor");
    expect(skipButton.className).not.toContain("top-14");

    const nextButton = screen.getByRole("button", { name: "下一步" });
    const ctaWrapper = nextButton.closest("div")?.parentElement as HTMLElement;
    expect(ctaWrapper.className).toContain("pb-safe-sheet");
  });
});
