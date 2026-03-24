import { useEffect, useState } from "react";
import { Edit3, Trash2, Share2, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import RemoteImage from "@/components/RemoteImage";
import { toast } from "@/components/ui/sonner";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { deleteRecognitionHistory, getRecognitionDetail } from "@/services/recognition-service";
import type { RecognitionResult } from "@/types/api";

type RecordDetailLocationState = {
  recognitionId?: number;
  record?: RecognitionResult;
};

const formatDateTime = (value: string, language: "zh-CN" | "en-US", t: (cn: string, en: string) => string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("未知时间", "Unknown time");
  return new Intl.DateTimeFormat(language === "en-US" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const RecordDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useI18n();
  const locationState = (location.state ?? {}) as RecordDetailLocationState;
  const recognitionId = locationState.recognitionId ?? locationState.record?.recognitionId;
  const [detail, setDetail] = useState<RecognitionResult | null>(locationState.record ?? null);
  const [loading, setLoading] = useState(recognitionId !== undefined && !locationState.record);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (recognitionId === undefined) return;

    let cancelled = false;
    setLoading(true);
    getRecognitionDetail(recognitionId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : t("记录详情加载失败，请稍后重试", "Failed to load record details. Please try again."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [recognitionId, t]);

  if (recognitionId === undefined) {
    return (
      <MobileLayout>
        <div className="h-full bg-background px-5 py-8 flex flex-col items-center justify-center text-center">
          <p className="text-subtitle text-foreground">{t("暂无记录详情", "No record details available")}</p>
          <button onClick={() => navigate("/history")} className="mt-6 h-[44px] px-6 bg-primary text-primary-foreground rounded-lg text-btn btn-tap">
            {t("返回历史记录", "Back to history")}
          </button>
        </div>
      </MobileLayout>
    );
  }

  const record = detail;
  const isUnknown = Boolean(record?.isUnknown || !record?.species);
  const speciesName = isUnknown
    ? t("未识别到昆虫", "No insect detected")
    : language === "en-US"
      ? record?.species?.latinName
      : record?.species?.name;
  const note = record?.note || t("暂无备注", "No notes yet");
  const locationName = record?.location || t("未记录地点", "No location recorded");
  const confidence = record ? `${(record.confidence * 100).toFixed(1)}%` : "--";
  const imageSrc = resolveSpeciesCover({
    recognitionImageUrl: record?.imageUrl,
    fallbackSrc: insectMantis,
  });

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteRecognitionHistory(recognitionId);
      toast.success(t("记录已删除", "Record deleted"));
      navigate("/history", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("删除失败，请稍后重试", "Failed to delete record. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="relative h-full overflow-y-auto hide-scrollbar bg-background pb-safe-page">
        <div className="relative h-[280px]">
          <RemoteImage
            src={imageSrc}
            fallbackSrc={insectMantis}
            alt={speciesName || "record"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0">
            <PageHeader title="" transparent />
          </div>
        </div>

        <div className="px-5 -mt-8 relative z-10">
            <div className="bg-card rounded-2xl p-4 card-shadow micro-border">
              <h2 className="text-title text-foreground">{speciesName || t("加载中...", "Loading...")}</h2>
            <p className="text-caption text-muted-foreground italic">{isUnknown ? "-" : record?.species?.latinName || "-"}</p>
            <div className="mt-4 space-y-3 text-caption">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("识别时间", "Captured at")}</span>
                <span className="text-foreground text-right">{record ? formatDateTime(record.capturedAt, language, t) : t("加载中...", "Loading...")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("置信度", "Confidence")}</span>
                <span className="text-primary font-semibold">{confidence}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground">{t("识别地点", "Location")}</span>
                <span className="text-foreground flex items-center gap-1 text-right"><MapPin size={14} /> {locationName}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">{t("备注", "Notes")}</h3>
            <p className="text-caption text-muted-foreground">{note}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-safe-sheet flex gap-3">
          <button
            onClick={() => navigate("/edit-record", { state: { recognitionId, record } })}
            className="flex-1 h-[44px] bg-primary/10 text-primary rounded-lg text-btn btn-tap flex items-center justify-center gap-2"
          >
            <Edit3 size={18} /> {t("编辑", "Edit")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting || loading}
            aria-label={t("删除记录", "Delete record")}
            className="h-[44px] px-4 bg-destructive/10 text-destructive rounded-lg text-btn btn-tap flex items-center justify-center disabled:opacity-60"
          >
            <Trash2 size={18} />
          </button>
          <button
            aria-label={t("分享记录", "Share record")}
            className="h-[44px] px-4 bg-secondary text-foreground rounded-lg text-btn btn-tap flex items-center justify-center"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RecordDetailPage;
