import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Image, Search, Bell } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectBee from "@/assets/insect-bee.jpg";
import insectGrasshopper from "@/assets/insect-grasshopper.jpg";
import { useI18n } from "@/lib/language";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const recentItems = [
    { img: insectMantis, name: t("中华螳螂", "Chinese mantis"), time: t("2 小时前", "2h ago") },
    { img: insectButterfly, name: t("帝王蝶", "Monarch butterfly"), time: t("昨天", "Yesterday") },
    { img: insectBeetle, name: t("锹甲", "Stag beetle"), time: t("3 天前", "3 days ago") },
    { img: insectBee, name: t("蜜蜂", "Bee"), time: t("1 周前", "1 week ago") },
    { img: insectGrasshopper, name: t("蝗虫", "Grasshopper"), time: t("2 周前", "2 weeks ago") },
  ];

  const discoveries = [
    { img: insectButterfly, name: t("帝王蝶", "Monarch butterfly"), count: t("1,234 次识别", "1,234 recognitions") },
    { img: insectBee, name: t("蜜蜂", "Bee"), count: t("986 次识别", "986 recognitions") },
  ];

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="flex items-center justify-between px-5 pt-1 pb-2">
          <h1 className="text-display text-foreground">{t("昆虫识别", "BugSight")}</h1>
          <button onClick={() => navigate("/notifications")} className="btn-tap relative min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Bell size={24} className="text-foreground" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
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
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5">
            {recentItems.map((item, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/result")}
                className="flex-shrink-0 w-[130px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-[130px] h-[130px] rounded-xl overflow-hidden card-shadow micro-border">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-caption text-foreground font-medium mt-2 truncate">{item.name}</p>
                <p className="text-small text-muted-foreground">{item.time}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-6 px-5">
          <h2 className="text-subtitle text-foreground mb-3">{t("热门发现", "Popular discoveries")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {discoveries.map((item, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/species-wiki")}
                className="bg-card rounded-xl overflow-hidden card-shadow micro-border"
              >
                <img src={item.img} alt={item.name} className="w-full h-24 object-cover" />
                <div className="p-3">
                  <p className="text-caption text-foreground font-semibold">{item.name}</p>
                  <p className="text-small text-muted-foreground">{item.count}</p>
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
