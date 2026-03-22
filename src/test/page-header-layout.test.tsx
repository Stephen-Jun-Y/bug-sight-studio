import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import PageHeader from "@/components/PageHeader";

describe("PageHeader layout", () => {
  it("uses a safe-area aware top offset instead of hard-coded pt-14", () => {
    const { container } = render(
      <MemoryRouter>
        <PageHeader title="设置" />
      </MemoryRouter>,
    );

    expect(screen.getByText("设置")).toBeInTheDocument();
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("safe-top-offset");
    expect(wrapper.className).not.toContain("pt-14");
  });
});
