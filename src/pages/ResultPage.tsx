import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Share2, Flag, MoreHorizontal, ChevronRight, MapPin, Ruler, Sun, Shield } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { toast } from "@/components/ui/sonner";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { getLocalizedField, getLocalizedValue } from "@/lib/insect-i18n";
import { resolveSpeciesCover, shouldRevokePreviewUrl } from "@/lib/species-cover";
import { useCurrentRecognition } from "@/lib/use-current-recognition";
import { getFavoriteStatus, toggleFavorite } from "@/services/favorite-service";
import { getSpeciesDetail } from "@/services/species-service";
import type { InsectInfo, LocalizedText, RecognitionResult } from "@/types/api";

type ResultLocationState = {
  recognition?: RecognitionResult;
  previewUrl?: string;
};

const buildFallbackDetail = (recognition: RecognitionResult): InsectInfo => ({
  id: recognition.species.id,
  speciesNameCn: recognition.species.name,
  speciesNameEn: recognition.species.latinName,
  orderName: "Lepidoptera",
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
  coverImageUrl: recognition.imageUrl,
  createdAt: null,
  updatedAt: null,
});

const localizedOrFallback = (value: LocalizedText, cnFallback = "待补充", enFallback = "To be added.") => ({
  cn: value.cn || cnFallback,
  en: value.en || enFallback,
});

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useI18n();
  const locationState = (location.state ?? {}) as ResultLocationState;
  const recognition = useCurrentRecognition(locationState.recognition);
  const speciesId = recognition?.species.id;
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favoritePending, setFavoritePending] = useState(false);
  const [detail, setDetail] = useState<InsectInfo | null>(() => (recognition ? buildFallbackDetail(recognition) : null));

  useEffect(() => {
    if (!shouldRevokePreviewUrl(locationState.previewUrl)) return;
    return () => {
      URL.revokeObjectURL(locationState.previewUrl!);
    };
  }, [locationState.previewUrl]);

  useEffect(() => {
    setDetail(recognition ? buildFallbackDetail(recognition) : null);
  }, [recognition]);

  useEffect(() => {
    if (!recognition || speciesId === undefined) return;

    let cancelled = false;
    getSpeciesDetail(speciesId)
      .then(data => {
        if (!cancelled) {
          setDetail(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(buildFallbackDetail(recognition));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [recognition, speciesId]);

  useEffect(() => {
    if (speciesId === undefined) return;

    let cancelled = false;
    getFavoriteStatus(speciesId)
      .then(({ isFavorited }) => {
        if (!cancelled) {
          setLiked(isFavorited);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiked(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [speciesId]);

  const handleFavoriteToggle = async () => {
    if (speciesId === undefined || favoritePending) return;

    setFavoritePending(true);
    try {
      const { isFavorited } = await toggleFavorite(speciesId);
      setLiked(isFavorited);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("收藏操作失败，请稍后重试", "Failed to update favorite. Please try again."));
    } finally {
      setFavoritePending(false);
    }
  };

  const infoCards = useMemo(() => {
    if (!detail) return [];
    return [
      {
        icon: MapPin,
        label: t("分布区域", "Distribution"),
        value: localizedOrFallback(getLocalizedField(detail, "distribution")),
        color: "text-primary",
      },
      {
        icon: Ruler,
        label: t("体长范围", "Body length"),
        value: localizedOrFallback(getLocalizedField(detail, "bodyLength")),
        color: "text-warning",
      },
      {
        icon: Sun,
        label: t("活跃季节", "Active season"),
        value: localizedOrFallback(getLocalizedField(detail, "activeSeason")),
        color: "text-destructive",
      },
      {
        icon: Shield,
        label: t("保护等级", "Protection"),
        value: localizedOrFallback(getLocalizedField(detail, "protectionLevel", { cn: "未评估", en: "Not evaluated" }), "未评估", "Not evaluated"),
        color: "text-success",
      },
    ];
  }, [detail, t]);

  if (!recognition) {
    return (
      <MobileLayout>
        <div className="h-full bg-background px-5 py-8 flex flex-col items-center justify-center text-center">
          <p className="text-subtitle text-foreground">{t("暂无识别结果", "No recognition result yet")}</p>
          <p className="text-caption text-muted-foreground mt-2">{t("请先完成一次图片识别", "Start a scan to see the result here")}</p>
          <button
            onClick={() => navigate("/scan")}
            className="mt-6 h-[44px] px-6 bg-primary text-primary-foreground rounded-lg text-btn btn-tap"
          >
            {t("去识别", "Start scanning")}
          </button>
        </div>
      </MobileLayout>
    );
  }

  const confidencePercent = (recognition.confidence * 100).toFixed(1);
  const imageSrc = resolveSpeciesCover({
    coverImageUrl: detail?.coverImageUrl,
    recognitionImageUrl: recognition.imageUrl,
    previewUrl: locationState.previewUrl,
    allowPreviewUrl: true,
    fallbackSrc: insectMantis,
  });
  const description = detail
    ? localizedOrFallback(getLocalizedField(detail, "description", { cn: "百科信息待补充。", en: "Bilingual profile is pending." }), "百科信息待补充。", "Bilingual profile is pending.")
    : { cn: "百科信息待补充。", en: "Bilingual profile is pending." };
  const speciesName = language === "en-US" ? detail?.speciesNameEn || recognition.species.latinName : detail?.speciesNameCn || recognition.species.name;
  const descriptionText = getLocalizedValue(description, language, t("百科信息待补充。", "Profile pending."));

  return (
    <MobileLayout>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full overflow-y-auto hide-scrollbar bg-background pb-safe-sheet"
      >
        <PageHeader title={t("识别结果", "Recognition result")} right={<MoreHorizontal size={22} className="text-muted-foreground" />} />

        <div className="px-5 mt-2">
          <div className="rounded-2xl overflow-hidden card-shadow">
            <img src={imageSrc} alt={speciesName} className="w-full h-56 object-cover" />
          </div>
        </div>

        <div className="px-5 mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-small text-muted-foreground">{t("匹配度", "Confidence")}</span>
            <span className="text-small text-primary font-semibold">{confidencePercent}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        <div className="px-5 mt-4">
          <h2 className="text-title text-foreground">{speciesName}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 mt-4">
          {infoCards.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-xl p-3 card-shadow micro-border"
            >
              <Icon size={18} className={color} />
              <p className="text-small text-muted-foreground mt-1">{label}</p>
              <p className="text-caption text-foreground font-semibold">{getLocalizedValue(value, language, t("待补充", "To be added."))}</p>
            </motion.div>
          ))}
        </div>

        <div className="px-5 mt-4">
          <div className="bg-card rounded-xl p-4 card-shadow micro-border">
            <h3 className="text-subtitle text-foreground mb-2">{t("百科介绍", "Profile")}</h3>
            <div className={`${!expanded ? "line-clamp-4" : ""}`}>
              <p className="text-caption text-muted-foreground leading-relaxed">{descriptionText}</p>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="text-primary text-caption mt-2">
              {expanded ? t("收起", "Collapse") : t("查看更多", "Read more")}
            </button>
          </div>
        </div>

        <div className="px-5 mt-4">
          <button onClick={() => navigate("/similar-species")} className="w-full bg-card rounded-xl p-4 card-shadow micro-border flex items-center justify-between tap-scale">
            <div className="text-left">
              <p className="text-subtitle text-foreground">{t("相似物种", "Similar species")}</p>
              <p className="text-small text-muted-foreground">
                {language === "en-US"
                  ? `View ${recognition.similar.length} similar results`
                  : `查看 ${recognition.similar.length} 个相似物种`}
              </p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 mt-6 flex gap-3">
          {[
            { icon: Heart, label: t("收藏", "Favorite"), active: liked, onClick: handleFavoriteToggle, disabled: favoritePending },
            { icon: Share2, label: t("分享", "Share") },
            { icon: Flag, label: t("报告", "Report") },
          ].map(({ icon: Icon, label, active, onClick, disabled }, i) => (
            <button
              key={i}
              onClick={onClick}
              disabled={disabled}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl btn-tap ${
                active ? "bg-primary/10 text-primary" : "bg-card card-shadow text-muted-foreground"
              } ${disabled ? "opacity-60" : ""}`}
            >
              <Icon size={20} fill={active ? "currentColor" : "none"} />
              <span className="text-small">{label}</span>
            </button>
          ))}
        </div>

        <div className="px-5 mt-4 mb-6">
          <button
            onClick={() => navigate("/species-wiki", { state: { speciesId } })}
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap"
          >
            {t("查看完整百科", "Open full profile")}
          </button>
        </div>
      </motion.div>
    </MobileLayout>
  );
};

export default ResultPage;
