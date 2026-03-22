import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ChangePasswordPage from "@/pages/ChangePasswordPage";

const navigateMock = vi.hoisted(() => vi.fn());
const changeCurrentUserPasswordMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/services/user-service", () => ({
  changeCurrentUserPassword: (...args: unknown[]) => changeCurrentUserPasswordMock(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

describe("ChangePasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeCurrentUserPasswordMock.mockResolvedValue({ success: true });
  });

  it("submits the new password and navigates to settings", async () => {
    render(
      <LanguageProvider>
        <ChangePasswordPage />
      </LanguageProvider>,
    );

    fireEvent.change(screen.getByLabelText("当前密码"), { target: { value: "OldPass123" } });
    fireEvent.change(screen.getByLabelText("新密码"), { target: { value: "NewPass123" } });
    fireEvent.change(screen.getByLabelText("确认新密码"), { target: { value: "NewPass123" } });
    fireEvent.click(screen.getByRole("button", { name: "确认修改" }));

    await waitFor(() =>
      expect(changeCurrentUserPasswordMock).toHaveBeenCalledWith({
        currentPassword: "OldPass123",
        newPassword: "NewPass123",
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/settings");
  });

  it("does not allow weak passwords to submit", async () => {
    render(
      <LanguageProvider>
        <ChangePasswordPage />
      </LanguageProvider>,
    );

    fireEvent.change(screen.getByLabelText("当前密码"), { target: { value: "OldPass123" } });
    fireEvent.change(screen.getByLabelText("新密码"), { target: { value: "abcdefgh" } });
    fireEvent.change(screen.getByLabelText("确认新密码"), { target: { value: "abcdefgh" } });

    expect(screen.getByRole("button", { name: "确认修改" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "确认修改" }));

    expect(changeCurrentUserPasswordMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
