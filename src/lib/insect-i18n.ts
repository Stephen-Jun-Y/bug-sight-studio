import type { InsectInfo, InsectI18n, LocalizedText } from "@/types/api";
import type { AppLanguage } from "@/lib/language";

export type LocalizedFieldKey = keyof InsectI18n;

const LEGACY_FIELD_MAP: Record<LocalizedFieldKey, { cn: keyof InsectInfo; en: keyof InsectInfo }> = {
  orderName: { cn: "orderNameCn", en: "orderName" },
  familyName: { cn: "familyNameCn", en: "familyName" },
  genusName: { cn: "genusNameCn", en: "genusName" },
  bodyLength: { cn: "bodyLength", en: "bodyLengthEn" },
  distribution: { cn: "distribution", en: "distributionEn" },
  activeSeason: { cn: "activeSeason", en: "activeSeasonEn" },
  protectionLevel: { cn: "protectionLevel", en: "protectionLevelEn" },
  description: { cn: "description", en: "descriptionEn" },
  morphology: { cn: "morphology", en: "morphologyEn" },
  habits: { cn: "habits", en: "habitsEn" },
};

const normalize = (value?: string | null) => {
  if (!value || !value.trim()) return undefined;
  return value.trim();
};

export const getLocalizedField = (
  info: InsectInfo,
  key: LocalizedFieldKey,
  fallback: { cn?: string; en?: string } = {},
): LocalizedText => {
  const nested = info.i18n?.[key];
  const mapping = LEGACY_FIELD_MAP[key];
  const legacyCn = normalize(info[mapping.cn] as string | null | undefined);
  const legacyEn = normalize(info[mapping.en] as string | null | undefined);

  return {
    cn: normalize(nested?.cn) ?? legacyCn ?? fallback.cn,
    en: normalize(nested?.en) ?? legacyEn ?? fallback.en,
  };
};

export const hasSecondaryEnglish = (value?: LocalizedText) => {
  const cn = normalize(value?.cn);
  const en = normalize(value?.en);
  return Boolean(en && en !== cn);
};

export const getLocalizedValue = (
  value: LocalizedText | undefined,
  language: AppLanguage,
  fallback = "",
) => {
  const primary = language === "en-US" ? normalize(value?.en) ?? normalize(value?.cn) : normalize(value?.cn) ?? normalize(value?.en);
  return primary ?? fallback;
};
