import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LANGUAGE_STORAGE_KEY } from "@/lib/language";
import { LanguageProvider } from "@/lib/language";
import SettingsPage from "@/pages/SettingsPage";

const navigateMock = vi.hoisted(() => vi.fn());
const deleteCurrentUserMock = vi.hoisted(() => vi.fn());
const clearAuthMock = vi.hoisted(() => vi.fn());
const toastSuccessMock = vi.hoisted(() => vi.fn());
const toastErrorMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/services/user-service", () => ({
  deleteCurrentUser: (...args: unknown[]) => deleteCurrentUserMock(...args),
}));

vi.mock("@/lib/auth", () => ({
  clearAuth: clearAuthMock,
}));

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

describe("SettingsPage account actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    deleteCurrentUserMock.mockResolvedValue({ success: true });
  });

  it("confirms and deletes the current account before clearing auth and navigating away", async () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <LanguageProvider>
        <SettingsPage />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "注销账号" }));

    await waitFor(() => expect(confirmMock).toHaveBeenCalled());
    await waitFor(() => expect(deleteCurrentUserMock).toHaveBeenCalledTimes(1));
    expect(clearAuthMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/auth", { replace: true });

    confirmMock.mockRestore();
  });

  it("keeps auth state intact and shows an error when delete account fails", async () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);
    deleteCurrentUserMock.mockRejectedValue(new Error("delete failed"));

    render(
      <LanguageProvider>
        <SettingsPage />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "注销账号" }));

    await waitFor(() => expect(deleteCurrentUserMock).toHaveBeenCalledTimes(1));
    expect(clearAuthMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith("delete failed");

    confirmMock.mockRestore();
  });

  it("clears local app settings without touching auth state", async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en-US");

    render(
      <LanguageProvider>
        <SettingsPage />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear cache" }));

    await waitFor(() => expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull());
    expect(clearAuthMock).not.toHaveBeenCalled();
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  it("does not render the removed push notifications setting", () => {
    render(
      <LanguageProvider>
        <SettingsPage />
      </LanguageProvider>,
    );

    expect(screen.queryByText("推送通知")).not.toBeInTheDocument();
    expect(screen.queryByText("Push notifications")).not.toBeInTheDocument();
  });
});
