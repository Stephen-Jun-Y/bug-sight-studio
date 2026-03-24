import { describe, expect, it } from "vitest";
import config from "../../capacitor.config";

describe("capacitor config", () => {
  it("enables CapacitorHttp patching for native requests", () => {
    expect(config.plugins?.CapacitorHttp?.enabled).toBe(true);
  });
});
