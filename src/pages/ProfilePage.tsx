import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, ChevronRight, Heart, Award, MapPin, HelpCircle, Edit3 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";

const stats = [
  { value: "128", label: "物种" },
  { value: "23", label: "地点" },
  { value: "56", label: "天数" },
];

const menuGroups = [
  [
    { icon: Heart, label: "我的收藏", path: "/favorites", count: "32" },
    { icon: Award, label: "成就徽章", path: "/achievements", count: "8/24" },
    { icon: MapPin, label: "观察地图", path: "/observation-map" },
  ],
  [
    { icon: Settings, label: "设置", path: "/settings" },
    { icon: HelpCircle, label: "帮助与反馈", path: "/help" },
  ],
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="pt-14 pb-24 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4">
          <h1 className="text-display text-foreground">我的</h1>
          <button onClick={() => navigate("/settings")} className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Settings size={22} className="text-muted-foreground" />
          </button>
        </div>

        {/* Profile card */}
        <div className="px-5 mt-4">
          <div className="bg-card rounded-2xl p-5 card-shadow micro-border text-center">
            <div className="w-20 h-20 rounded-full mx-auto bg-secondary border-[3px] border-primary overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[36px]">🦋</div>
            </div>
            <h2 className="text-[20px] font-bold text-foreground mt-3">自然探索者</h2>
            <p className="text-caption text-tertiary-40 mt-1">已识别 128 种昆虫</p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-3 text-caption text-primary flex items-center gap-1 mx-auto"
            >
              <Edit3 size={14} /> 编辑资料
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 px-5 mt-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 bg-card rounded-xl p-3 card-shadow micro-border text-center"
            >
              <p className="text-title text-foreground">{s.value}</p>
              <p className="text-small text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Menu groups */}
        {menuGroups.map((group, gi) => (
          <div key={gi} className="px-5 mt-4">
            <div className="bg-card rounded-xl card-shadow micro-border overflow-hidden">
              {group.map(({ icon: Icon, label, path, count }, i) => (
                <button
                  key={i}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 tap-scale border-b border-border last:border-0"
                >
                  <Icon size={20} className="text-primary" />
                  <span className="flex-1 text-body text-foreground text-left">{label}</span>
                  {count && <span className="text-small text-muted-foreground">{count}</span>}
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="px-5 mt-6">
          <button className="w-full text-center py-3 text-body text-destructive btn-tap">
            退出登录
          </button>
        </div>
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default ProfilePage;
