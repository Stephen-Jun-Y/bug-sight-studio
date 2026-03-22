import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("native page finishing", () => {
  it("uses safe-area aware spacing on the auth screen", () => {
    const source = readSource("pages/AuthPage.tsx");

    expect(source).toContain("safe-top-offset");
    expect(source).toContain("pb-safe-sheet");
    expect(source).not.toContain("pt-20");
    expect(source).not.toContain("pb-8");
  });

  it("keeps the settings page on the shared native-safe scrolling pattern", () => {
    const source = readSource("pages/SettingsPage.tsx");

    expect(source).toContain("pb-safe-sheet");
    expect(source).toContain("<PageHeader");
  });

  it("pins the post-detail composer to the viewport and reserves bottom space for it", () => {
    const source = readSource("pages/PostDetailPage.tsx");

    expect(source).toContain("pb-safe-page");
    expect(source).toContain("fixed bottom-0 left-0 right-0");
    expect(source).not.toContain("pb-20");
    expect(source).not.toContain("absolute bottom-0 left-0 right-0");
  });

  it("uses a viewport-fixed share sheet for native presentation", () => {
    const source = readSource(path.join("components", "ShareSheet.tsx"));

    expect(source).toContain("fixed inset-0");
    expect(source).toContain("fixed bottom-0 left-0 right-0");
    expect(source).not.toContain("absolute inset-0");
    expect(source).not.toContain("absolute bottom-0 left-0 right-0");
  });
});
