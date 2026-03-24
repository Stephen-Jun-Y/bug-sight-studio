import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "..", "..");
const coversDir = path.join(root, "public", "wiki-covers");
const expectedIds = [
  0, 3, 8, 10, 14, 15, 16, 18, 22, 23, 24, 38, 39, 45, 48, 50, 51, 54, 58, 67, 68, 69, 70, 86, 101,
];

describe("wiki cover assets", () => {
  it("contains one 4:3 cover file for each supported class id", () => {
    const files = fs.existsSync(coversDir) ? fs.readdirSync(coversDir).filter((file) => file.endsWith(".jpg")) : [];

    expect(files.sort()).toEqual(expectedIds.map((id) => `${id}.jpg`).sort());
  });
});
