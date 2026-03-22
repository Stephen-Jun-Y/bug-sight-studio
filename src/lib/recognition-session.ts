import type { RecognitionResult } from "@/types/api";

const CURRENT_RECOGNITION_KEY = "currentRecognition";

export type StoredRecognition = {
  recognition: RecognitionResult;
};

export const saveCurrentRecognition = (payload: StoredRecognition) => {
  sessionStorage.setItem(CURRENT_RECOGNITION_KEY, JSON.stringify(payload));
};

export const getCurrentRecognition = (): StoredRecognition | null => {
  const raw = sessionStorage.getItem(CURRENT_RECOGNITION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredRecognition;
  } catch {
    return null;
  }
};

export const clearCurrentRecognition = () => {
  sessionStorage.removeItem(CURRENT_RECOGNITION_KEY);
};
