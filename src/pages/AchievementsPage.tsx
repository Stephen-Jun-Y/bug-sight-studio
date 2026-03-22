import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const AchievementsPage = () => {
  const { t } = useI18n();

  const badges = [
    { name: t("初次识别", "First scan"), icon: "🔍", unlocked: true, date: "2024-01-15", desc: t("完成第一次识别", "Complete your first recognition") },
    { name: t("昆虫达人", "Insect expert"), icon: "🏆", unlocked: true, date: "2024-02-20", desc: t("识别50种昆虫", "Recognize 50 insect species") },
    { name: t("摄影师", "Photographer"), icon: "📷", unlocked: true, date: "2024-03-01", desc: t("上传100张照片", "Upload 100 photos") },
    { name: t("探索者", "Explorer"), icon: "🗺️", unlocked: true, date: "2024-03-05", desc: t("在10个不同地点识别", "Scan in 10 different locations") },
    { name: t("收藏家", "Collector"), icon: "⭐", unlocked: true, date: "2024-03-08", desc: t("收藏30种昆虫", "Favorite 30 species") },
    { name: t("社区之星", "Community star"), icon: "💬", unlocked: true, date: "2024-03-09", desc: t("获得100个点赞", "Receive 100 likes") },
    { name: t("连续打卡", "Streak keeper"), icon: "🔥", unlocked: true, date: "2024-03-10", desc: t("连续7天识别", "Scan for 7 days in a row") },
    { name: t("百科全书", "Wiki reader"), icon: "📖", unlocked: true, date: "2024-03-10", desc: t("阅读50篇百科", "Read 50 species profiles") },
    { name: t("鳞翅目专家", "Lepidoptera expert"), icon: "🦋", unlocked: false, desc: t("识别所有蝴蝶种类", "Recognize every butterfly type") },
    { name: t("夜行观察", "Night observer"), icon: "🌙", unlocked: false, desc: t("在夜间识别10种昆虫", "Recognize 10 insects at night") },
    { name: t("全国旅行", "Nationwide traveler"), icon: "✈️", unlocked: false, desc: t("在30个省份识别", "Scan insects in 30 provinces") },
    { name: t("传说猎人", "Legend hunter"), icon: "👑", unlocked: false, desc: t("识别1000种昆虫", "Recognize 1000 insect species") },
  ];

  const unlocked = badges.filter(b => b.unlocked).length;
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet">
        <PageHeader title={t("成就徽章", "Achievements")} />
        <div className="px-5 mt-2">
          <p className="text-caption text-muted-foreground mb-2">
            {languageText(t, `已解锁 ${unlocked}/${badges.length} 个徽章`, `${unlocked}/${badges.length} badges unlocked`)}
          </p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked / badges.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card rounded-xl p-3 card-shadow micro-border text-center ${!b.unlocked ? "opacity-40 grayscale" : ""}`}
              >
                <div className="text-[32px] mb-1">{b.icon}</div>
                <p className="text-small text-foreground font-semibold truncate">{b.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {b.unlocked ? b.date : b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

const languageText = (t: (cn: string, en?: string) => string, cn: string, en: string) => t(cn, en);

export default AchievementsPage;
