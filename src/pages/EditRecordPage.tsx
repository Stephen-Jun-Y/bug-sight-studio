import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/components/ui/sonner";
import { useI18n } from "@/lib/language";
import { getRecognitionDetail, updateRecognitionHistory } from "@/services/recognition-service";
import type { RecognitionResult } from "@/types/api";

type EditRecordLocationState = {
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

const EditRecordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useI18n();
  const locationState = (location.state ?? {}) as EditRecordLocationState;
  const recognitionId = locationState.recognitionId ?? locationState.record?.recognitionId;
  const [record, setRecord] = useState<RecognitionResult | null>(locationState.record ?? null);
  const [note, setNote] = useState(locationState.record?.note ?? "");
  const [locationName, setLocationName] = useState(locationState.record?.location ?? "");
  const [loading, setLoading] = useState(recognitionId !== undefined && !locationState.record);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (recognitionId === undefined) return;

    let cancelled = false;
    if (!locationState.record) {
      setLoading(true);
    }

    getRecognitionDetail(recognitionId)
      .then((data) => {
        if (!cancelled) {
          setRecord(data);
          setNote(data.note ?? "");
          setLocationName(data.location ?? "");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : t("记录加载失败，请稍后重试", "Failed to load the record. Please try again."));
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
  }, [locationState.record, recognitionId, t]);

  if (recognitionId === undefined) {
    return (
      <MobileLayout>
        <div className="h-full bg-background px-5 py-8 flex flex-col items-center justify-center text-center">
          <p className="text-subtitle text-foreground">{t("暂无可编辑记录", "No editable record available")}</p>
          <button onClick={() => navigate("/history")} className="mt-6 h-[44px] px-6 bg-primary text-primary-foreground rounded-lg text-btn btn-tap">
            {t("返回历史记录", "Back to history")}
          </button>
        </div>
      </MobileLayout>
    );
  }

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await updateRecognitionHistory(recognitionId, {
        note: note.trim() || null,
        locationName: locationName.trim() || null,
      });
      toast.success(t("记录已更新", "Record updated"));
      navigate("/record-detail", {
        replace: true,
        state: {
          recognitionId,
          record: record
            ? {
                ...record,
                note: note.trim() || null,
                location: locationName.trim() || null,
              }
            : undefined,
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("保存失败，请稍后重试", "Failed to save changes. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader title={t("编辑记录", "Edit record")} />
        <div className="px-5 mt-4 space-y-4">
          <div>
            <label htmlFor="record-note" className="text-small text-muted-foreground mb-1 block">{t("备注", "Notes")}</label>
            <textarea
              id="record-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              className="w-full bg-card rounded-md px-4 py-3 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow resize-none"
              placeholder={t("补充你的观察备注", "Add your observation notes")}
            />
          </div>
          <div>
            <label htmlFor="record-location" className="text-small text-muted-foreground mb-1 block">{t("地点", "Location")}</label>
            <input
              id="record-location"
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
              className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow"
              placeholder={t("填写识别地点", "Enter the capture location")}
            />
          </div>
          <div>
            <label className="text-small text-muted-foreground mb-1 block">{t("时间", "Time")}</label>
            <div className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border text-left flex items-center justify-between">
              <span>{record ? formatDateTime(record.capturedAt, language, t) : t("加载中...", "Loading...")}</span>
              <span className="text-muted-foreground text-small">{t("暂不可编辑", "Read only")}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => navigate(-1)} className="flex-1 h-[50px] bg-secondary text-foreground rounded-lg text-btn btn-tap">{t("取消", "Cancel")}</button>
            <button onClick={handleSave} disabled={saving || loading} className="flex-1 h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap disabled:opacity-60">{t("保存", "Save")}</button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EditRecordPage;
