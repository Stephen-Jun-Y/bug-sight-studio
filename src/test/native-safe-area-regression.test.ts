import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("native safe-area regression", () => {
  it("defines shared utilities for floating actions and bottom overlays", () => {
    const css = readSource("index.css");

    expect(css).toContain(".bottom-safe-fab");
    expect(css).toContain(".bottom-safe-overlay");
  });

  it("removes hard-coded top and bottom spacing from the main navigation pages", () => {
    const files = [
      ["pages/HomePage.tsx", ["safe-top-offset", "pb-safe-page"], ["pt-14", "pb-24"]],
      ["pages/SearchPage.tsx", ["safe-top-offset", "pb-safe-page"], ["pt-14"]],
      ["pages/HistoryPage.tsx", ["safe-top-offset", "pb-safe-page", "bottom-safe-overlay"], ["pt-14", "bottom-20", "pb-24", "pb-40"]],
      ["pages/CommunityPage.tsx", ["safe-top-offset", "pb-safe-page", "bottom-safe-fab"], ["pt-14", "pb-24", "bottom-24"]],
      ["pages/ProfilePage.tsx", ["safe-top-offset", "pb-safe-page"], ["pt-14", "pb-24"]],
    ] as const;

    files.forEach(([filePath, expectedTokens, unexpectedTokens]) => {
      const source = readSource(filePath);

      expectedTokens.forEach((token) => expect(source).toContain(token));
      unexpectedTokens.forEach((token) => expect(source).not.toContain(token));
    });
  });

  it("uses safe-area padding for detail pages and bottom action sheets", () => {
    const files = [
      ["pages/SearchFilterPage.tsx", ["pb-safe-page", "pb-safe-sheet"], ["pb-24", "pb-8"]],
      ["pages/RecordDetailPage.tsx", ["pb-safe-page", "pb-safe-sheet"], ["pb-24", "pb-8"]],
      ["pages/ResultPage.tsx", ["pb-safe-sheet"], ["pb-24"]],
      ["pages/SpeciesWikiPage.tsx", ["pb-safe-sheet"], ["pb-24"]],
    ] as const;

    files.forEach(([filePath, expectedTokens, unexpectedTokens]) => {
      const source = readSource(filePath);

      expectedTokens.forEach((token) => expect(source).toContain(token));
      unexpectedTokens.forEach((token) => expect(source).not.toContain(token));
    });
  });
});
