import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useI18n } from "@/lib/language";
import { resolveSpeciesCover } from "@/lib/species-cover";
import { listFavorites } from "@/services/favorite-service";
import type { InsectInfo } from "@/types/api";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [items, setItems] = useState<InsectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    listFavorites({ page: 1, pageSize: 20 })
      .then((data) => {
        if (!cancelled) {
          setItems(data.list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : t("收藏加载失败，请稍后重试", "Failed to load favorites. Please try again."));
          setItems([]);
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

  const emptyMessage = loading
    ? t("正在加载收藏...", "Loading favorites...")
    : error || t("你还没有收藏任何昆虫", "You have not favorited any insects yet");

  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader title={t("我的收藏", "Favorites")} right={<button className="text-caption text-primary">{t("编辑", "Edit")}</button>} />

        {items.length > 0 ? (
          <div className="px-5 mt-2 grid grid-cols-2 gap-3">
            {items.map((item, i) => {
              const name = language === "en-US" ? item.speciesNameEn : item.speciesNameCn;
              const subtitle = language === "en-US"
                ? `Recognized ${item.recognitionCount} times`
                : `已识别 ${item.recognitionCount} 次`;
              const imageSrc = resolveSpeciesCover({
                coverImageUrl: item.coverImageUrl,
                fallbackSrc: insectMantis,
              });

              return (
                <motion.button
                  type="button"
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => navigate("/species-wiki", { state: { speciesId: item.id } })}
                  className="bg-card rounded-xl overflow-hidden card-shadow micro-border tap-scale text-left"
                >
                  <img src={imageSrc} alt={name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-caption text-foreground font-semibold line-clamp-1">{name}</p>
                    <p className="text-small text-muted-foreground">{subtitle}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-muted-foreground text-caption">
            {emptyMessage}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
