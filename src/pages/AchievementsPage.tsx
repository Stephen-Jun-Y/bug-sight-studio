import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const badges = [
  { name: "初次识别", icon: "🔍", unlocked: true, date: "2024-01-15", desc: "完成第一次识别" },
  { name: "昆虫达人", icon: "🏆", unlocked: true, date: "2024-02-20", desc: "识别50种昆虫" },
  { name: "摄影师", icon: "📷", unlocked: true, date: "2024-03-01", desc: "上传100张照片" },
  { name: "探索者", icon: "🗺️", unlocked: true, date: "2024-03-05", desc: "在10个不同地点识别" },
  { name: "收藏家", icon: "⭐", unlocked: true, date: "2024-03-08", desc: "收藏30种昆虫" },
  { name: "社区之星", icon: "💬", unlocked: true, date: "2024-03-09", desc: "获得100个点赞" },
  { name: "连续打卡", icon: "🔥", unlocked: true, date: "2024-03-10", desc: "连续7天识别" },
  { name: "百科全书", icon: "📖", unlocked: true, date: "2024-03-10", desc: "阅读50篇百科" },
  { name: "鳞翅目专家", icon: "🦋", unlocked: false, desc: "识别所有蝴蝶种类" },
  { name: "夜行观察", icon: "🌙", unlocked: false, desc: "在夜间识别10种昆虫" },
  { name: "全国旅行", icon: "✈️", unlocked: false, desc: "在30个省份识别" },
  { name: "传说猎人", icon: "👑", unlocked: false, desc: "识别1000种昆虫" },
];

const AchievementsPage = () => {
  const unlocked = badges.filter(b => b.unlocked).length;
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8">
        <PageHeader title="成就徽章" />
        <div className="px-5 mt-2">
          <p className="text-caption text-muted-foreground mb-2">已解锁 {unlocked}/{badges.length} 个徽章</p>
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

export default AchievementsPage;
