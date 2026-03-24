import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RemoteImage from "@/components/RemoteImage";

const isNativePlatformMock = vi.hoisted(() => vi.fn());

vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: (...args: unknown[]) => isNativePlatformMock(...args),
  },
}));

describe("RemoteImage", () => {
  const originalFetch = global.fetch;
  const createObjectURLMock = vi.fn(() => "blob:remote-image");
  const revokeObjectURLMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    isNativePlatformMock.mockReturnValue(true);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["image"], { type: "image/jpeg" }),
    } as unknown as Response);
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("converts native remote images into blob URLs so app pages do not depend on WebView direct HTTP loading", async () => {
    const { unmount } = render(
      <RemoteImage
        src="http://124.221.209.129:8080/api/v1/files/example.jpg"
        fallbackSrc="/fallback.jpg"
        alt="history record"
        className="preview"
      />,
    );

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("http://124.221.209.129:8080/api/v1/files/example.jpg"),
    );
    await waitFor(() =>
      expect(screen.getByRole("img", { name: "history record" })).toHaveAttribute("src", "blob:remote-image"),
    );

    unmount();

    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:remote-image");
  });

  it("falls back when remote loading fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network failed"));

    render(
      <RemoteImage
        src="http://124.221.209.129:8080/api/v1/files/example.jpg"
        fallbackSrc="/fallback.jpg"
        alt="history record"
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("img", { name: "history record" })).toHaveAttribute("src", "/fallback.jpg"),
    );
  });

  it("keeps direct URLs on web builds", async () => {
    isNativePlatformMock.mockReturnValue(false);

    render(
      <RemoteImage
        src="http://124.221.209.129:8080/api/v1/files/example.jpg"
        fallbackSrc="/fallback.jpg"
        alt="history record"
      />,
    );

    expect(screen.getByRole("img", { name: "history record" })).toHaveAttribute(
      "src",
      "http://124.221.209.129:8080/api/v1/files/example.jpg",
    );
    await act(async () => {});
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
