import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language";
import BindPhonePage from "@/pages/BindPhonePage";

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

describe("BindPhonePage", () => {
  it("shows the unavailable-state messaging", () => {
    render(
      <LanguageProvider>
        <BindPhonePage />
      </LanguageProvider>,
    );

    expect(screen.getByText("暂未开放")).toBeInTheDocument();
    expect(screen.getByText("Not available yet")).toBeInTheDocument();
    expect(screen.getByText("未来将支持手机号找回账号与安全验证。")).toBeInTheDocument();
    expect(screen.getByText("Future support will include phone-based account recovery and security verification.")).toBeInTheDocument();
  });
});
