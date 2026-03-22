import { describe, expect, it } from "vitest";
import { getLocalizedField } from "@/lib/insect-i18n";
import type { InsectInfo } from "@/types/api";

const buildBaseInfo = (): InsectInfo => ({
  id: 1,
  speciesNameCn: "稻纵卷叶螟",
  speciesNameEn: "Cnaphalocrocis medinalis",
  orderName: "Lepidoptera",
  familyName: "Crambidae",
  genusName: "Cnaphalocrocis",
  bodyLength: "中文体长",
  bodyLengthEn: "English body length",
  distribution: "中文分布",
  distributionEn: "English distribution",
  activeSeason: "中文季节",
  activeSeasonEn: "English season",
  protectionLevel: "未评估",
  protectionLevelEn: "Not evaluated",
  harmLevel: 2,
  description: "中文介绍",
  descriptionEn: "English description",
  morphology: "中文形态",
  morphologyEn: "English morphology",
  habits: "中文习性",
  habitsEn: "English habits",
  recognitionCount: 0,
  coverImageUrl: "",
  createdAt: null,
  updatedAt: null,
  i18n: {
    bodyLength: { cn: "卡片中文体长", en: "Card English body length" },
    distribution: { cn: "卡片中文分布", en: "Card English distribution" },
    activeSeason: { cn: "卡片中文季节", en: "Card English season" },
    protectionLevel: { cn: "卡片中文保护", en: "Card English protection" },
    description: { cn: "卡片中文介绍", en: "Card English description" },
    morphology: { cn: "卡片中文形态", en: "Card English morphology" },
    habits: { cn: "卡片中文习性", en: "Card English habits" },
    orderName: { cn: "鳞翅目", en: "Lepidoptera" },
    familyName: { cn: "螟蛾科", en: "Crambidae" },
    genusName: { cn: "纵卷叶螟属", en: "Cnaphalocrocis" },
  },
});

describe("getLocalizedField", () => {
  it("prefers i18n payload when available", () => {
    const info = buildBaseInfo();
    expect(getLocalizedField(info, "description")).toEqual({
      cn: "卡片中文介绍",
      en: "Card English description",
    });
  });

  it("falls back to legacy fields when i18n payload is missing", () => {
    const info = buildBaseInfo();
    delete info.i18n;
    expect(getLocalizedField(info, "description")).toEqual({
      cn: "中文介绍",
      en: "English description",
    });
  });
});
