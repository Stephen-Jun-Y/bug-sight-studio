import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import { toast } from "@/components/ui/sonner";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { batchDeleteRecognitionHistory, listRecognitionHistory } from "@/services/recognition-service";
import type { RecognitionResult } from "@/types/api";

type HistoryGroup = {
  label: string;
  items: RecognitionResult[];
};

const buildDateLabel = (value: string, language: "zh-CN" | "en-US", t: (cn: string, en: string) => string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return t("未知日期", "Unknown date");
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startOfToday - startOfTarget) / 86400000);

  if (diffDays === 0) return t("今天", "Today");
  if (diffDays === 1) return t("昨天", "Yesterday");

  return language === "en-US"
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    : `${date.getMonth() + 1}月${date.getDate()}日`;
};

const buildTimeLabel = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [records, setRecords] = useState<RecognitionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [managing, setManaging] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    listRecognitionHistory({ page: 1, pageSize: 20 })
      .then((data) => {
        if (!cancelled) {
          setRecords(data.list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("历史记录加载失败，请稍后重试", "Failed to load history. Please try again."));
          setRecords([]);
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
  }, [t]);

  const groups = useMemo<HistoryGroup[]>(() => {
    const bucket = new Map<string, HistoryGroup>();
    const sorted = [...records].sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

    sorted.forEach((item) => {
      const label = buildDateLabel(item.capturedAt, language, t);
      if (!bucket.has(label)) {
        bucket.set(label, { label, items: [] });
      }
      bucket.get(label)!.items.push(item);
    });

    return Array.from(bucket.values());
  }, [language, records, t]);

  const emptyMessage = loading
    ? t("正在加载历史记录...", "Loading history...")
    : error || t("还没有识别记录", "No recognition history yet");

  const toggleSelected = (recognitionId: number) => {
    setSelectedIds((current) =>
      current.includes(recognitionId)
        ? current.filter((id) => id !== recognitionId)
        : [...current, recognitionId],
    );
  };

  const toggleManage = () => {
    setManaging((current) => !current);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === records.length ? [] : records.map((item) => item.recognitionId),
    );
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0 || deleting) return;

    setDeleting(true);
    try {
      await batchDeleteRecognitionHistory(selectedIds);
      setRecords((current) => current.filter((item) => !selectedIds.includes(item.recognitionId)));
      setSelectedIds([]);
      setManaging(false);
      toast.success(t("已删除所选记录", "Selected records deleted"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("批量删除失败，请稍后重试", "Failed to delete selected records. Please try again."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="px-5 pt-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-display text-foreground">{t("历史记录", "History")}</h1>
            {records.length > 0 && (
              <button onClick={toggleManage} className="text-body text-primary btn-tap">
                {managing ? t("取消", "Cancel") : t("管理", "Manage")}
              </button>
            )}
          </div>
          <button onClick={() => navigate("/search")} className="w-full h-[44px] bg-card glass rounded-md px-4 flex items-center gap-2 tap-scale">
            <Search size={18} className="text-muted-foreground" />
            <span className="text-body text-muted-foreground">{t("搜索记录", "Search records")}</span>
          </button>
        </div>

        {groups.length > 0 ? groups.map((group, gi) => (
          <div key={group.label} className="mt-5">
            <p className="px-5 text-caption text-muted-foreground font-semibold mb-2">{group.label}</p>
            <div className="px-5 space-y-2">
              {group.items.map((item, i) => {
                const speciesName = language === "en-US" ? item.species.latinName : item.species.name;
                const location = item.location || t("未记录地点", "No location recorded");
                const confidence = `${(item.confidence * 100).toFixed(1)}%`;
                const imageSrc = resolveSpeciesCover({
                  recognitionImageUrl: item.imageUrl,
                  fallbackSrc: insectMantis,
                });
                const checked = selectedIds.includes(item.recognitionId);

                return (
                  <motion.button
                    key={item.recognitionId}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (managing) {
                        toggleSelected(item.recognitionId);
                        return;
                      }
                      navigate("/record-detail", { state: { recognitionId: item.recognitionId } });
                    }}
                    className="w-full bg-card rounded-xl p-3 card-shadow micro-border flex items-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.08 + i * 0.04 }}
                  >
                    {managing && (
                      <input
                        type="checkbox"
                        checked={checked}
                        aria-label={t(`选择记录 ${item.recognitionId}`, `Select record ${item.recognitionId}`)}
                        onChange={() => toggleSelected(item.recognitionId)}
                        onClick={(event) => event.stopPropagation()}
                        className="h-4 w-4 accent-primary"
                      />
                    )}
                    <img src={imageSrc} alt={speciesName} className="w-[60px] h-[60px] rounded-sm object-cover flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-body text-foreground font-bold truncate">{speciesName}</p>
                      <p className="text-small text-tertiary-40 truncate">{buildTimeLabel(item.capturedAt)} · {location}</p>
                      <p className="text-small text-primary">{confidence} {t("匹配", "match")}</p>
                    </div>
                    {!managing && <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )) : (
          <div className="px-5 py-10 text-center text-muted-foreground text-caption">
            {emptyMessage}
          </div>
        )}

        {managing && records.length > 0 && (
          <div className="fixed bottom-safe-overlay left-1/2 -translate-x-1/2 w-full max-w-[430px] glass px-5 py-3 flex gap-3">
            <button onClick={toggleSelectAll} className="flex-1 h-[44px] bg-secondary text-foreground rounded-lg text-btn btn-tap">
              {selectedIds.length === records.length ? t("取消全选", "Clear all") : t("全选", "Select all")}
            </button>
            <button
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0 || deleting}
              className="flex-1 h-[44px] bg-destructive text-destructive-foreground rounded-lg text-btn btn-tap disabled:opacity-60"
            >
              {t("删除已选", "Delete selected")}
            </button>
          </div>
        )}
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default HistoryPage;
