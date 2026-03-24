import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language";
import ScanPage from "@/pages/ScanPage";

const navigateMock = vi.hoisted(() => vi.fn());
const getPhotoMock = vi.hoisted(() => vi.fn());
const getUserMediaMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@capacitor/camera", () => ({
  Camera: {
    getPhoto: (...args: unknown[]) => getPhotoMock(...args),
  },
  CameraResultType: { Uri: "uri" },
  CameraSource: { Camera: "CAMERA" },
}));

vi.mock("@/components/MobileLayout", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/services/recognition-service", () => ({
  recognizeInsect: vi.fn(),
}));

const createFakeStream = () => ({
  getTracks: () => [{ stop: vi.fn() }],
}) as unknown as MediaStream;

describe("ScanPage camera", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: getUserMediaMock,
      },
      configurable: true,
    });

    getUserMediaMock.mockResolvedValue(createFakeStream());
    getPhotoMock.mockResolvedValue({ webPath: "https://example.com/camera.jpg", format: "jpeg" });

    Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
      configurable: true,
      writable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });

    Object.defineProperty(window.HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      writable: true,
      value: vi.fn(() => ({
        drawImage: vi.fn(),
      })),
    });

    Object.defineProperty(window.HTMLCanvasElement.prototype, "toBlob", {
      configurable: true,
      writable: true,
      value(callback: BlobCallback) {
        callback(new Blob(["frame"], { type: "image/jpeg" }));
      },
    });

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(() => "blob:preview"),
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  });

  it("starts live camera preview and captures from the video frame when available", async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ScanPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getUserMediaMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByLabelText(/实时取景画面|live camera preview/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /拍照|take photo/i }));

    await waitFor(() => expect(screen.getByText(/确认识别|recognize/i)).toBeInTheDocument());
    expect(getPhotoMock).not.toHaveBeenCalled();
  });

  it("falls back to the native camera when live preview is unavailable", async () => {
    getUserMediaMock.mockRejectedValueOnce(new Error("Permission denied"));

    Object.defineProperty(globalThis, "fetch", {
      value: vi.fn().mockResolvedValue({
        ok: true,
        blob: async () => new Blob(["camera-image"], { type: "image/jpeg" }),
      }),
      configurable: true,
    });

    render(
      <LanguageProvider>
        <MemoryRouter>
          <ScanPage />
        </MemoryRouter>
      </LanguageProvider>,
    );

    await waitFor(() => expect(getUserMediaMock).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(/未获得相机权限|falling back to the system camera/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /拍照|take photo/i }));

    await waitFor(() => expect(getPhotoMock).toHaveBeenCalled());
  });
});
