import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const groups = [
    {
      title: "账号安全",
      items: [
        { label: "修改密码", action: "nav" as const, path: "/change-password" },
        { label: "绑定手机", value: "138****1234", action: "nav" as const, path: "/bind-phone" },
      ],
    },
    {
      title: "通知设置",
      items: [
        { label: "推送通知", action: "toggle" as const, checked: notifications, onChange: () => setNotifications(!notifications) },
      ],
    },
    {
      title: "隐私设置",
      items: [
        { label: "隐私政策", action: "nav" as const, path: "/privacy-policy" },
        { label: "数据导出", action: "nav" as const, path: "/data-export" },
      ],
    },
    {
      title: "关于",
      items: [
        { label: "版本号", value: "v2.1.0", action: "none" as const },
        { label: "用户协议", action: "nav" as const, path: "/user-agreement" },
      ],
    },
  ];

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="设置" />
        {groups.map((group, gi) => (
          <div key={gi} className="px-5 mt-4">
            <p className="text-small text-muted-foreground mb-2 uppercase tracking-wider">{group.title}</p>
            <div className="bg-card rounded-xl card-shadow micro-border overflow-hidden">
              {group.items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => item.action === "nav" && item.path && navigate(item.path)}
                  className={`flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 ${item.action === "nav" ? "cursor-pointer tap-scale" : ""}`}
                >
                  <span className="text-body text-foreground">{item.label}</span>
                  {item.action === "nav" && (
                    <div className="flex items-center gap-1">
                      {item.value && <span className="text-small text-muted-foreground">{item.value}</span>}
                      <ChevronRight size={18} className="text-muted-foreground" />
                    </div>
                  )}
                  {item.action === "toggle" && (
                    <button
                      onClick={item.onChange}
                      className={`w-[51px] h-[31px] rounded-full transition-colors ${item.checked ? "bg-primary" : "bg-muted"} relative`}
                    >
                      <div className={`w-[27px] h-[27px] bg-card rounded-full absolute top-[2px] transition-transform ${item.checked ? "translate-x-[22px]" : "translate-x-[2px]"} card-shadow`} />
                    </button>
                  )}
                  {item.action === "none" && <span className="text-small text-muted-foreground">{item.value}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Danger zone */}
        <div className="px-5 mt-6 space-y-3">
          <button className="w-full text-center py-3 text-body text-destructive btn-tap">清除缓存</button>
          <button className="w-full text-center py-3 text-body text-destructive btn-tap">注销账号</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
