import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";
import { getMyAchievements } from "@/services/user-service";
import type { AchievementItem } from "@/types/api";

const AchievementsPage = () => {
  const { t } = useI18n();
  const [items, setItems] = useState<AchievementItem[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getMyAchievements()
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setUnlockedCount(data.unlockedCount);
        setTotalCount(data.totalCount);
      })
      .catch((nextError: unknown) => {
        if (cancelled) return;
        setError(nextError instanceof Error ? nextError.message : t("加载徽章失败，请稍后重试", "Failed to load achievements. Please try again later."));
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

  const progressWidth = useMemo(() => {
    if (totalCount <= 0) return 0;
    return (unlockedCount / totalCount) * 100;
  }, [totalCount, unlockedCount]);

  const formatUnlockedAt = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet">
        <PageHeader title={t("成就徽章", "Achievements")} />
        <div className="px-5 mt-2">
          {loading ? (
            <p className="text-caption text-muted-foreground py-10">{t("正在加载徽章...", "Loading achievements...")}</p>
          ) : error ? (
            <p className="text-caption text-destructive py-10">{error}</p>
          ) : (
            <>
              <p className="text-caption text-muted-foreground mb-2">
                {languageText(t, `已解锁 ${unlockedCount}/${totalCount} 个徽章`, `${unlockedCount}/${totalCount} badges unlocked`)}
              </p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              {items.length === 0 ? (
                <p className="text-caption text-muted-foreground py-10">{t("还没有可展示的徽章", "No achievements to show yet")}</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {items.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-card rounded-xl p-3 card-shadow micro-border text-center ${!badge.unlocked ? "opacity-50 grayscale" : ""}`}
                    >
                      <div className="text-[32px] mb-1">{badge.icon}</div>
                      <p className="text-small text-foreground font-semibold truncate">{badge.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 min-h-[32px]">
                        {badge.unlocked
                          ? t(`解锁于 ${formatUnlockedAt(badge.unlockedAt)}`, `Unlocked ${formatUnlockedAt(badge.unlockedAt)}`)
                          : badge.description}
                      </p>
                      {!badge.unlocked && (
                        <p className="text-[11px] text-primary mt-1">
                          {t(`${badge.currentValue}/${badge.targetValue}`, `${badge.currentValue}/${badge.targetValue}`)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

const languageText = (t: (cn: string, en?: string) => string, cn: string, en: string) => t(cn, en);

export default AchievementsPage;
