import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Image, Search } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import RemoteImage from "@/components/RemoteImage";
import TabBar from "@/components/TabBar";
import { toast } from "@/components/ui/sonner";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { getHomeFeed } from "@/services/home-feed-service";
import type { HomeFeedData } from "@/types/api";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [feed, setFeed] = useState<HomeFeedData>({ recentItems: [], popularItems: [] });

  useEffect(() => {
    let active = true;

    const loadFeed = async () => {
      try {
        const nextFeed = await getHomeFeed();

        if (!active) return;
        setFeed(nextFeed);
      } catch (error) {
        if (!active) return;
        toast.error(error instanceof Error ? error.message : t("首页数据加载失败，请稍后重试", "Failed to load home feed. Please try again."));
      }
    };

    void loadFeed();

    return () => {
      active = false;
    };
  }, [t]);

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="flex items-center justify-between px-5 pt-1 pb-2">
          <h1 className="text-display text-foreground">{t("昆虫识别", "BugSight")}</h1>
        </div>

        <div className="px-5 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/scan")}
            className="w-full h-[180px] bg-primary rounded-2xl card-shadow relative overflow-hidden flex flex-col items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-success opacity-90" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Camera size={28} className="text-primary-foreground" />
              </div>
              <span className="text-title text-primary-foreground">{t("点击拍照识别", "Tap to scan")}</span>
              <span className="text-caption text-primary-foreground/60">{t("支持拍照和相册识别", "Use camera or gallery photos")}</span>
            </div>
          </motion.button>
        </div>

        <div className="flex gap-3 px-5 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-card rounded-xl p-4 card-shadow micro-border flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Image size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-subtitle text-foreground text-[15px]">{t("从相册", "From gallery")}</p>
              <p className="text-small text-muted-foreground">{t("选择照片识别", "Pick a saved photo")}</p>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/search")}
            className="flex-1 bg-card rounded-xl p-4 card-shadow micro-border flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Search size={20} className="text-warning" />
            </div>
            <div className="text-left">
              <p className="text-subtitle text-foreground text-[15px]">{t("搜索", "Search")}</p>
              <p className="text-small text-muted-foreground">{t("搜索昆虫物种", "Find insect species")}</p>
            </div>
          </motion.button>
        </div>

        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-subtitle text-foreground">{t("最近识别", "Recent scans")}</h2>
            <button onClick={() => navigate("/history")} className="text-caption text-primary">{t("查看全部", "View all")}</button>
          </div>
          {feed.recentItems.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5">
              {feed.recentItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/record-detail", { state: { recognitionId: Number(item.id) } })}
                  className="flex-shrink-0 w-[130px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-[130px] h-[130px] rounded-xl overflow-hidden card-shadow micro-border">
                    <RemoteImage
                      src={resolveSpeciesCover({ recognitionImageUrl: item.imageUrl, fallbackSrc: insectMantis })}
                      alt={t(item.speciesNameCn, item.speciesNameEn)}
                      fallbackSrc={insectMantis}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-caption text-foreground font-medium mt-2 truncate">
                    {t(item.speciesNameCn, item.speciesNameEn)}
                  </p>
                  <p className="text-small text-muted-foreground">{t(item.capturedLabelCn, item.capturedLabelEn)}</p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-4 card-shadow micro-border text-center text-caption text-muted-foreground">
              {t("还没有识别记录，去拍一张试试吧", "No scans yet. Start with a new photo.")}
            </div>
          )}
        </div>

        <div className="mt-6 px-5">
          <h2 className="text-subtitle text-foreground mb-3">{t("热门发现", "Popular discoveries")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {feed.popularItems.map((item, i) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/species-wiki", { state: { speciesId: Number(item.id) } })}
                className="bg-card rounded-xl overflow-hidden card-shadow micro-border"
              >
                <RemoteImage
                  src={resolveSpeciesCover({ coverImageUrl: item.imageUrl, fallbackSrc: insectMantis })}
                  alt={t(item.speciesNameCn, item.speciesNameEn)}
                  fallbackSrc={insectMantis}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <p className="text-caption text-foreground font-semibold">{t(item.speciesNameCn, item.speciesNameEn)}</p>
                  <p className="text-small text-muted-foreground">{t(item.recognitionLabelCn, item.recognitionLabelEn)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default HomePage;
