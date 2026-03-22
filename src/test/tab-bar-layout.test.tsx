import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language";
import TabBar from "@/components/TabBar";

describe("TabBar layout", () => {
  it("uses bottom safe-area classes instead of hard-coded bottom padding only", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/home"]}>
        <LanguageProvider>
          <TabBar />
        </LanguageProvider>
      </MemoryRouter>,
    );

    const outer = container.firstElementChild as HTMLElement;
    expect(outer.className).toContain("safe-bottom");

    const inner = outer.firstElementChild as HTMLElement;
    expect(inner.className).toContain("pb-safe-tab");
    expect(inner.className).not.toContain("pb-6");
  });
});
