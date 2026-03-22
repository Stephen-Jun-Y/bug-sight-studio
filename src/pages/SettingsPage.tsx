import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/components/ui/sonner";
import { clearAuth } from "@/lib/auth";
import { LANGUAGE_STORAGE_KEY, useI18n } from "@/lib/language";
import { deleteCurrentUser } from "@/services/user-service";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const { language, setLanguage, t } = useI18n();

  const groups = [
    {
      title: t("账号安全", "Account Security"),
      items: [
        { label: t("修改密码", "Change password"), action: "nav" as const, path: "/change-password" },
        { label: t("绑定手机", "Bind phone"), value: "138****1234", action: "nav" as const, path: "/bind-phone" },
      ],
    },
    {
      title: t("通用设置", "General"),
      items: [
        { label: t("语言", "Language"), action: "language" as const },
        { label: t("推送通知", "Push notifications"), action: "toggle" as const, checked: notifications, onChange: () => setNotifications(!notifications) },
      ],
    },
    {
      title: t("隐私设置", "Privacy"),
      items: [
        { label: t("隐私政策", "Privacy policy"), action: "nav" as const, path: "/privacy-policy" },
        { label: t("数据导出", "Data export"), action: "nav" as const, path: "/data-export" },
      ],
    },
    {
      title: t("关于", "About"),
      items: [
        { label: t("版本号", "Version"), value: "v2.1.0", action: "none" as const },
        { label: t("用户协议", "User agreement"), action: "nav" as const, path: "/user-agreement" },
      ],
    },
  ];

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("确定要注销账号吗？此操作无法撤销。", "Delete your account? This cannot be undone."))) {
      return;
    }

    try {
      await deleteCurrentUser();
      clearAuth();
      navigate("/auth", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("注销账号失败，请稍后重试", "Failed to delete account. Please try again."));
    }
  };

  const handleClearCache = () => {
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    toast.success(t("已清除本地缓存", "Local cache cleared"));
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("设置", "Settings")} />
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
                      aria-label={item.label}
                      className={`w-[51px] h-[31px] rounded-full transition-colors ${item.checked ? "bg-primary" : "bg-muted"} relative`}
                    >
                      <div className={`w-[27px] h-[27px] bg-card rounded-full absolute top-[2px] transition-transform ${item.checked ? "translate-x-[22px]" : "translate-x-[2px]"} card-shadow`} />
                    </button>
                  )}
                  {item.action === "language" && (
                    <div className="inline-flex items-center rounded-full bg-secondary p-1 card-shadow micro-border">
                      {[
                        { value: "zh-CN" as const, label: "中文" },
                        { value: "en-US" as const, label: "English" },
                      ].map(option => {
                        const active = language === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setLanguage(option.value)}
                            className={`min-w-[72px] h-8 rounded-full px-3 text-small font-semibold transition-colors btn-tap ${active ? "bg-card text-foreground" : "text-muted-foreground"}`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {item.action === "none" && <span className="text-small text-muted-foreground">{item.value}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="px-5 mt-6 space-y-3">
          <button onClick={handleClearCache} className="w-full text-center py-3 text-body text-destructive btn-tap">{t("清除缓存", "Clear cache")}</button>
          <button onClick={handleDeleteAccount} className="w-full text-center py-3 text-body text-destructive btn-tap">{t("注销账号", "Delete account")}</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
