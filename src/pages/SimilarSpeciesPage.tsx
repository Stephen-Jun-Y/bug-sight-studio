import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectGrasshopper from "@/assets/insect-grasshopper.jpg";
import { useI18n } from "@/lib/language";
import { getLocalizedField, getLocalizedValue } from "@/lib/insect-i18n";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { useCurrentRecognition } from "@/lib/use-current-recognition";
import { getSimilarSpecies } from "@/services/species-service";
import type { InsectInfo, LocalizedText } from "@/types/api";

const fallbackImages = [insectMantis, insectBeetle, insectGrasshopper];

const localizedOrFallback = (value: LocalizedText, cnFallback = "待补充", enFallback = "To be added.") => ({
  cn: value.cn || cnFallback,
  en: value.en || enFallback,
});

const SimilarSpeciesPage = () => {
  const { language, t } = useI18n();
  const recognition = useCurrentRecognition();
  const speciesId = recognition?.species.id;
  const [species, setSpecies] = useState<InsectInfo[]>([]);

  useEffect(() => {
    if (speciesId === undefined) return;

    let cancelled = false;
    getSimilarSpecies(speciesId)
      .then(data => {
        if (!cancelled) {
          setSpecies(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSpecies([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [speciesId]);

  const cards = useMemo(() => {
    if (!recognition) return [];
    if (species.length > 0) {
      return species.map((item, index) => {
        const score = recognition.similar.find(entry => entry.speciesId === item.id)?.score;
        return {
          img: resolveSpeciesCover({
            coverImageUrl: item.coverImageUrl,
            fallbackSrc: fallbackImages[index % fallbackImages.length],
          }),
          name: language === "en-US" ? item.speciesNameEn : item.speciesNameCn,
          match: score ? `${(score * 100).toFixed(1)}%` : t("待比对", "Pending"),
          diffs: [
            { label: t("体长", "Body length"), value: localizedOrFallback(getLocalizedField(item, "bodyLength")) },
            { label: t("分布", "Distribution"), value: localizedOrFallback(getLocalizedField(item, "distribution")) },
            { label: t("保护等级", "Protection"), value: localizedOrFallback(getLocalizedField(item, "protectionLevel", { cn: "未评估", en: "Not evaluated" }), "未评估", "Not evaluated") },
          ],
        };
      });
    }

    return recognition.similar.map((item, index) => ({
      img: fallbackImages[index % fallbackImages.length],
      name: language === "en-US" ? `Class ${item.speciesId}` : item.name,
      match: `${(item.score * 100).toFixed(1)}%`,
      diffs: [
        { label: t("体长", "Body length"), value: { cn: "待补充", en: "To be added." } },
        { label: t("分布", "Distribution"), value: { cn: "待补充", en: "To be added." } },
        { label: t("保护等级", "Protection"), value: { cn: "未评估", en: "Not evaluated" } },
      ],
    }));
  }, [language, recognition, species, t]);

  if (!recognition) {
    return (
      <MobileLayout>
        <div className="h-full bg-background pb-safe-sheet px-5 flex flex-col items-center justify-center text-center">
          <p className="text-subtitle text-foreground">{t("暂无相似物种数据", "No similar species yet")}</p>
          <p className="text-caption text-muted-foreground mt-2">{t("请先完成一次识别", "Start a scan to compare similar species")}</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("相似物种", "Similar species")} />
        <div className="px-5 mt-2 flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-4">
          {cards.map((item, i) => (
            <motion.div
              key={`${item.name}-${i}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex-shrink-0 w-[260px] bg-card rounded-2xl card-shadow micro-border overflow-hidden"
            >
              <img src={item.img} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1 gap-3">
                  <h3 className="text-subtitle text-foreground truncate">{item.name}</h3>
                  <span className="text-small text-primary font-semibold whitespace-nowrap">{item.match}</span>
                </div>
                <p className="text-small text-muted-foreground font-semibold mb-1">{t("关键差异", "Key differences")}</p>
                <ul className="space-y-2">
                  {item.diffs.map((diff, diffIndex) => (
                    <li key={diffIndex} className="text-small text-muted-foreground flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      <div>
                        <p className="text-small text-foreground">{diff.label}: {getLocalizedValue(diff.value, language, t("待补充", "To be added."))}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SimilarSpeciesPage;
