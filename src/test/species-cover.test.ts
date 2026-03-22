import { describe, expect, it } from "vitest";
import { resolveSpeciesCover } from "@/lib/species-cover";

describe("resolveSpeciesCover", () => {
  it("prefers coverImageUrl over recognition and preview sources", () => {
    expect(
      resolveSpeciesCover({
        coverImageUrl: "/wiki-covers/67.jpg",
        recognitionImageUrl: "https://example.com/upload.jpg",
        previewUrl: "blob:http://127.0.0.1/demo",
        allowPreviewUrl: true,
        fallbackSrc: "/fallback.jpg",
      }),
    ).toBe("/wiki-covers/67.jpg");
  });

  it("does not reuse preview blobs outside the result page", () => {
    expect(
      resolveSpeciesCover({
        previewUrl: "blob:http://127.0.0.1/demo",
        allowPreviewUrl: false,
        fallbackSrc: "/fallback.jpg",
      }),
    ).toBe("/fallback.jpg");
  });

  it("falls back to recognition image and finally fallback image", () => {
    expect(
      resolveSpeciesCover({
        recognitionImageUrl: "https://example.com/upload.jpg",
        fallbackSrc: "/fallback.jpg",
      }),
    ).toBe("https://example.com/upload.jpg");

    expect(
      resolveSpeciesCover({
        fallbackSrc: "/fallback.jpg",
      }),
    ).toBe("/fallback.jpg");
  });
});
