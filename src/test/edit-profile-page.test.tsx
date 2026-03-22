import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import EditProfilePage from "@/pages/EditProfilePage";
import type { CurrentUserProfile } from "@/types/api";

const navigateMock = vi.hoisted(() => vi.fn());
const getCurrentUserProfileMock = vi.hoisted(() => vi.fn());
const updateCurrentUserProfileMock = vi.hoisted(() => vi.fn());
const updateStoredUserMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/lib/auth", () => ({
  updateStoredUser: updateStoredUserMock,
}));

vi.mock("@/services/user-service", () => ({
  getCurrentUserProfile: (...args: unknown[]) => getCurrentUserProfileMock(...args),
  updateCurrentUserProfile: (...args: unknown[]) => updateCurrentUserProfileMock(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title, right }: { title?: string; right?: ReactNode }) => (
    <div>
      <div>{title}</div>
      {right}
    </div>
  ),
}));

const profile: CurrentUserProfile = {
  id: 7,
  nickname: "后端昵称",
  bio: "喜欢观察昆虫",
  location: "上海",
};

const updatedProfile: CurrentUserProfile = {
  id: 7,
  nickname: "新的昵称",
  bio: "新的简介",
  location: "杭州",
};

describe("EditProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCurrentUserProfileMock.mockResolvedValue(profile);
    updateCurrentUserProfileMock.mockResolvedValue(updatedProfile);
  });

  it("loads the profile and submits the updated fields", async () => {
    render(
      <LanguageProvider>
        <EditProfilePage />
      </LanguageProvider>,
    );

    await waitFor(() => expect(getCurrentUserProfileMock).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: "更换头像" })).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("昵称")).toHaveValue("后端昵称"));
    await waitFor(() => expect(screen.getByLabelText("简介")).toHaveValue("喜欢观察昆虫"));
    await waitFor(() => expect(screen.getByLabelText("所在地")).toHaveValue("上海"));

    fireEvent.change(screen.getByLabelText("昵称"), { target: { value: "新的昵称" } });
    fireEvent.change(screen.getByLabelText("简介"), { target: { value: "新的简介" } });
    fireEvent.change(screen.getByLabelText("所在地"), { target: { value: "杭州" } });
    fireEvent.click(screen.getByRole("button", { name: "保存修改" }));

    await waitFor(() =>
      expect(updateCurrentUserProfileMock).toHaveBeenCalledWith({
        nickname: "新的昵称",
        bio: "新的简介",
        location: "杭州",
      }),
    );
    expect(updateStoredUserMock).toHaveBeenCalledWith(updatedProfile);
    expect(navigateMock).toHaveBeenCalledWith("/profile");
  });
});
