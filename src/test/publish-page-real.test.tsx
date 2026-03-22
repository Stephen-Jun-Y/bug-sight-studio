import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import PublishPage from "@/pages/PublishPage";

const createPost = vi.fn();

vi.mock("@/services/post-service", () => ({
  createPost: (...args: unknown[]) => createPost(...args),
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({ title, right }: { title: string; right?: ReactNode }) => (
    <div>
      <span>{title}</span>
      {right}
    </div>
  ),
}));

describe("PublishPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createPost.mockResolvedValue({
      id: 99,
      userId: 1,
      content: "分享一只新昆虫",
      imageUrl: "",
      topicTags: null,
      locationName: null,
      latitude: null,
      longitude: null,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      visibility: 1,
      createdAt: "2026-03-22T14:00:00",
      updatedAt: "2026-03-22T14:00:00",
    });
  });

  it("submits a real post and returns to community on success", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={["/publish"]}>
          <Routes>
            <Route path="/publish" element={<PublishPage />} />
            <Route path="/community" element={<div>Community Page</div>} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("分享你的发现..."), {
      target: { value: "分享一只新昆虫" },
    });

    fireEvent.click(screen.getByRole("button", { name: "发布" }));

    await waitFor(() =>
      expect(createPost).toHaveBeenCalledWith(
        {
          content: "分享一只新昆虫",
          visibility: 1,
        },
        undefined,
      ),
    );
    await waitFor(() => expect(screen.getByText("Community Page")).toBeInTheDocument());
  });
});
