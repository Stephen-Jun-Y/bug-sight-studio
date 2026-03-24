import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("notifications removal", () => {
  it("removes the notifications route and home bell entrypoint", () => {
    const appSource = readSource("App.tsx");
    const homeSource = readSource(path.join("pages", "HomePage.tsx"));

    expect(appSource).not.toContain('path="/notifications"');
    expect(appSource).not.toContain("NotificationsPage");
    expect(homeSource).not.toContain('navigate("/notifications")');
    expect(homeSource).not.toContain("Bell");
  });
});
