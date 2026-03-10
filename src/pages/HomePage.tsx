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

const recentItems = [
  { img: insectMantis, name: "中华螳螂", time: "2 小时前" },
  { img: insectButterfly, name: "帝王蝶", time: "昨天" },
  { img: insectBeetle, name: "锹甲", time: "3 天前" },
  { img: insectBee, name: "蜜蜂", time: "1 周前" },
  { img: insectGrasshopper, name: "蝗虫", time: "2 周前" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="pt-14 pb-24 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h1 className="text-display text-foreground">昆虫识别</h1>
          <button onClick={() => navigate("/notifications")} className="btn-tap relative min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Bell size={24} className="text-foreground" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>

        {/* Main scan card */}
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
              <span className="text-title text-primary-foreground">点击拍照识别</span>
              <span className="text-caption text-primary-foreground/60">支持拍照和相册识别</span>
            </div>
          </motion.button>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 px-5 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-card rounded-xl p-4 card-shadow micro-border flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Image size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-subtitle text-foreground text-[15px]">从相册</p>
              <p className="text-small text-muted-foreground">选择照片识别</p>
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
              <p className="text-subtitle text-foreground text-[15px]">搜索</p>
              <p className="text-small text-muted-foreground">搜索昆虫物种</p>
            </div>
          </motion.button>
        </div>

        {/* Recent */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-subtitle text-foreground">最近识别</h2>
            <button onClick={() => navigate("/history")} className="text-caption text-primary">查看全部</button>
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

        {/* Discover section */}
        <div className="mt-6 px-5">
          <h2 className="text-subtitle text-foreground mb-3">热门发现</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { img: insectButterfly, name: "帝王蝶", count: "1,234 次识别" },
              { img: insectBee, name: "蜜蜂", count: "986 次识别" },
            ].map((item, i) => (
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
