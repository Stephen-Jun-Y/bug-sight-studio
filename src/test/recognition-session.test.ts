import { beforeEach, describe, expect, it } from "vitest";
import { clearCurrentRecognition, getCurrentRecognition, saveCurrentRecognition } from "@/lib/recognition-session";

describe("recognition-session", () => {
  beforeEach(() => {
    clearCurrentRecognition();
  });

  it("stores and restores the latest recognition payload", () => {
    saveCurrentRecognition({
      recognition: {
        recognitionId: 1,
        species: {
          id: 0,
          name: "稻纵卷叶螟",
          latinName: "rice leaf roller",
        },
        confidence: 0.99,
        similar: [],
        imageUrl: "http://127.0.0.1/image.jpg",
        note: null,
        location: null,
        capturedAt: "2026-03-12T23:00:00",
      },
    });

    expect(getCurrentRecognition()?.recognition.species.name).toBe("稻纵卷叶螟");
    expect(getCurrentRecognition()?.recognition.species.id).toBe(0);
  });
});
