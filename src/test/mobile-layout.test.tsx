import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MobileLayout from "@/components/MobileLayout";

describe("MobileLayout", () => {
  it("renders as a full-screen app container without the preview phone shell", () => {
    const { container } = render(
      <MobileLayout>
        <section data-testid="page-content">Page Content</section>
      </MobileLayout>,
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();

    const shell = container.firstElementChild as HTMLElement;
    expect(shell.className).toContain("h-dvh");
    expect(shell.className).toContain("min-h-dvh");
    expect(shell.className).toContain("w-full");
    expect(shell.className).not.toContain("w-[390px]");
    expect(shell.className).not.toContain("safe-area");
    expect(shell.textContent).not.toContain("9:41");
    expect(screen.getByTestId("page-content").parentElement).toBe(shell);
  });
});
