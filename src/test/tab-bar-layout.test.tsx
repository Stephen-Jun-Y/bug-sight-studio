import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language";
import TabBar from "@/components/TabBar";

describe("TabBar layout", () => {
  it("uses bottom safe-area classes and a background shell instead of leaving the gesture area exposed", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <LanguageProvider>
          <TabBar />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain("pb-safe-tab");
    expect(outer.className).toContain("bg-background");
    expect(outer.className).toContain("border-t");
    expect(outer.className).not.toContain("bg-background/95");

    const inner = outer.firstElementChild as HTMLElement;
    expect(inner.className).not.toContain("glass");
    expect(inner.className).not.toContain("pb-safe-tab");
    expect(inner.className).not.toContain("pb-6");
  });
});
