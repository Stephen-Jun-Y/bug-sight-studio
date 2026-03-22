import { useState } from "react";
import { getCurrentRecognition } from "@/lib/recognition-session";
import type { RecognitionResult } from "@/types/api";

export const useCurrentRecognition = (initialRecognition?: RecognitionResult | null) => {
  const [storedRecognition] = useState(() => getCurrentRecognition()?.recognition ?? null);
  return initialRecognition ?? storedRecognition;
};
