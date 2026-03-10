import { Home, Camera, Clock, User, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "首页", path: "/home" },
  { icon: Camera, label: "识别", path: "/scan" },
  { icon: MessageCircle, label: "社区", path: "/community" },
  { icon: Clock, label: "记录", path: "/history" },
  { icon: User, label: "我的", path: "/profile" },
];

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="absolute bottom-0 left-0 right-0 glass z-40">
      <div className="flex items-center justify-around pb-6 pt-2">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
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
