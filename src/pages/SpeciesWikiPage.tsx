import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Heart, Share2, MapPin } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { getLocalizedField, getLocalizedValue } from "@/lib/insect-i18n";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { useCurrentRecognition } from "@/lib/use-current-recognition";
import { getSpeciesDetail } from "@/services/species-service";
import type { InsectInfo, LocalizedText } from "@/types/api";

type SpeciesWikiLocationState = {
  speciesId?: number;
};

const buildFallbackDetail = (id: number, name: string, latinName: string): InsectInfo => ({
  id,
  speciesNameCn: name,
  speciesNameEn: latinName,
  orderName: "Hemiptera",
  familyName: "To be added",
  genusName: "To be added",
  bodyLength: "待补充",
  bodyLengthEn: "To be added.",
  distribution: "待补充",
  distributionEn: "To be added.",
  activeSeason: "待补充",
  activeSeasonEn: "To be added.",
  protectionLevel: "未评估",
  protectionLevelEn: "Not evaluated",
  harmLevel: 1,
  description: "百科信息待补充。",
  descriptionEn: "Bilingual profile is pending.",
  morphology: "形态特征待补充。",
  morphologyEn: "Morphology details are pending.",
  habits: "生活习性待补充。",
  habitsEn: "Habit details are pending.",
  recognitionCount: 0,
  coverImageUrl: "",
  createdAt: null,
  updatedAt: null,
});

const localizedOrFallback = (value: LocalizedText, cnFallback = "待补充", enFallback = "To be added.") => ({
  cn: value.cn || cnFallback,
  en: value.en || enFallback,
});

const SpeciesWikiPage = () => {
  const location = useLocation();
  const { language, t } = useI18n();
  const recognition = useCurrentRecognition();
  const locationState = (location.state ?? {}) as SpeciesWikiLocationState;
  const speciesId = recognition?.species.id ?? locationState.speciesId;
  const fallbackName = recognition?.species.name ?? t("物种详情", "Species profile");
  const fallbackLatinName = recognition?.species.latinName ?? t("待补充", "To be added");
  const [detail, setDetail] = useState<InsectInfo | null>(() => (
    speciesId !== undefined ? buildFallbackDetail(speciesId, fallbackName, fallbackLatinName) : null
  ));

  useEffect(() => {
    setDetail(speciesId !== undefined ? buildFallbackDetail(speciesId, fallbackName, fallbackLatinName) : null);
  }, [fallbackLatinName, fallbackName, speciesId]);

  useEffect(() => {
    if (speciesId === undefined) return;

    let cancelled = false;
    getSpeciesDetail(speciesId)
      .then(data => {
        if (!cancelled) {
          setDetail(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(buildFallbackDetail(speciesId, fallbackName, fallbackLatinName));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackLatinName, fallbackName, speciesId]);

  const basicInfo = useMemo(() => {
    if (!detail) return [];
    return [
      [t("目", "Order"), localizedOrFallback(getLocalizedField(detail, "orderName"))],
      [t("科", "Family"), localizedOrFallback(getLocalizedField(detail, "familyName"))],
      [t("属", "Genus"), localizedOrFallback(getLocalizedField(detail, "genusName"))],
      [t("体长", "Body length"), localizedOrFallback(getLocalizedField(detail, "bodyLength"))],
      [t("分布", "Distribution"), localizedOrFallback(getLocalizedField(detail, "distribution"))],
      [t("保护等级", "Protection"), localizedOrFallback(getLocalizedField(detail, "protectionLevel", { cn: "未评估", en: "Not evaluated" }), "未评估", "Not evaluated")],
    ] as const;
  }, [detail, t]);

  if (!detail) {
    return (
      <MobileLayout>
        <div className="h-full bg-background pb-safe-sheet px-5 flex flex-col items-center justify-center text-center">
          <p className="text-subtitle text-foreground">{t("暂无百科详情", "No species profile yet")}</p>
          <p className="text-caption text-muted-foreground mt-2">{t("请先完成一次识别", "Start a scan to view a species profile")}</p>
        </div>
      </MobileLayout>
    );
  }

  const imageSrc = resolveSpeciesCover({
    coverImageUrl: detail.coverImageUrl,
    recognitionImageUrl: recognition?.imageUrl,
    fallbackSrc: insectMantis,
  });
  const morphology = localizedOrFallback(getLocalizedField(detail, "morphology", { cn: "形态特征待补充。", en: "Morphology details are pending." }), "形态特征待补充。", "Morphology details are pending.");
  const habits = localizedOrFallback(getLocalizedField(detail, "habits", { cn: "生活习性待补充。", en: "Habit details are pending." }), "生活习性待补充。", "Habit details are pending.");
  const distribution = localizedOrFallback(getLocalizedField(detail, "distribution"));
  const description = localizedOrFallback(getLocalizedField(detail, "description", { cn: "百科信息待补充。", en: "Bilingual profile is pending." }), "百科信息待补充。", "Bilingual profile is pending.");
  const protectionLevel = localizedOrFallback(getLocalizedField(detail, "protectionLevel", { cn: "未评估", en: "Not evaluated" }), "未评估", "Not evaluated");
  const speciesName = language === "en-US" ? detail.speciesNameEn : detail.speciesNameCn;

  return (
    <MobileLayout>
      <div className="relative h-full overflow-y-auto hide-scrollbar bg-background pb-safe-sheet">
        <div className="relative h-[300px]">
          <img src={imageSrc} alt={speciesName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0">
            <PageHeader title="" transparent />
          </div>
        </div>

        <div className="px-5 -mt-12 relative z-10">
          <h1 className="text-title text-foreground">{speciesName}</h1>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-3">{t("基本信息", "Basic information")}</h3>
            <div className="grid grid-cols-2 gap-y-3 text-caption">
              {basicInfo.map(([key, value], index) => (
                <div key={index}>
                  <span className="text-muted-foreground">{key}:</span>
                  <div className="mt-1">
                    <span className="text-foreground font-medium">{getLocalizedValue(value, language, t("待补充", "To be added."))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">{t("形态特征", "Morphology")}</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">{getLocalizedValue(morphology, language, t("待补充", "To be added."))}</p>
          </div>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">{t("生活习性", "Habits")}</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">{getLocalizedValue(habits, language, t("待补充", "To be added."))}</p>
          </div>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">{t("分布区域", "Distribution")}</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">{getLocalizedValue(distribution, language, t("待补充", "To be added."))}</p>
          </div>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">{t("百科介绍", "Profile")}</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">{getLocalizedValue(description, language, t("待补充", "To be added."))}</p>
          </div>

          <div className="flex gap-3 px-1 mt-4 mb-6 text-muted-foreground">
            <button className="flex items-center gap-1 text-caption btn-tap"><Heart size={18} /> {t("收藏", "Favorite")}</button>
            <button className="flex items-center gap-1 text-caption btn-tap"><Share2 size={18} /> {t("分享", "Share")}</button>
            <div className="flex items-center gap-1 text-caption"><MapPin size={18} /> {getLocalizedValue(protectionLevel, language, t("未评估", "Not evaluated"))}</div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SpeciesWikiPage;
