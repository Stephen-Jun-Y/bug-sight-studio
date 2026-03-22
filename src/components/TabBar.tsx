import { Home, Camera, Clock, User, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "@/lib/language";

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const tabs = [
    { icon: Home, label: t("首页", "Home"), path: "/home" },
    { icon: MessageCircle, label: t("社区", "Community"), path: "/community" },
    { icon: Camera, label: t("识别", "Scan"), path: "/scan", center: true },
    { icon: Clock, label: t("记录", "History"), path: "/history" },
    { icon: User, label: t("我的", "Me"), path: "/profile" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="glass flex items-center justify-around pb-safe-tab pt-2">
        {tabs.map(({ icon: Icon, label, path, center }) => {
          const active = location.pathname === path;
          if (center) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="relative -mt-7 btn-tap"
              >
                <div className="w-[56px] h-[56px] rounded-full bg-primary flex items-center justify-center card-shadow-hover border-4 border-card">
                  <Camera size={24} className="text-primary-foreground" />
                </div>
                <span className={`text-[10px] font-medium block text-center mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
              </button>
            );
          }
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 btn-tap min-w-[44px] min-h-[44px] justify-center ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
