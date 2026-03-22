import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, Bell as BellIcon } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useI18n();

  const tabs = [t("全部", "All"), t("互动", "Activity"), t("系统", "System")];
  const notifications = [
    { icon: Heart, color: "text-destructive", title: t("昆虫猎人 赞了你的动态", "Insect hunter liked your post"), time: t("2分钟前", "2m ago"), unread: true },
    { icon: MessageCircle, color: "text-primary", title: t("花园守护者 评论了你的照片", "Garden keeper commented on your photo"), time: t("30分钟前", "30m ago"), unread: true },
    { icon: UserPlus, color: "text-warning", title: t("微距摄影师 关注了你", "Macro photographer followed you"), time: t("1小时前", "1h ago"), unread: true },
    { icon: BellIcon, color: "text-muted-foreground", title: t("你的识别记录已达到100条！", "Your recognition history reached 100 records!"), time: t("昨天", "Yesterday"), unread: false },
    { icon: BellIcon, color: "text-muted-foreground", title: t("系统维护通知：3月15日凌晨2:00-4:00", "Maintenance notice: Mar 15, 2:00-4:00 AM"), time: t("3天前", "3 days ago"), unread: false },
  ];

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("消息通知", "Notifications")} showBack />
        <div className="flex gap-4 px-5 border-b border-border">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`pb-2 text-body relative ${i === activeTab ? "text-foreground font-bold" : "text-muted-foreground"}`}
            >
              {tab}
              {i === activeTab && (
                <motion.div layoutId="notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="px-5 mt-2 space-y-1">
          {notifications.map(({ icon: Icon, color, title, time, unread }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 py-3.5 border-b border-border ${unread ? "bg-primary/5 -mx-5 px-5 rounded-lg" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${unread ? "bg-primary/10" : "bg-secondary"}`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-caption ${unread ? "text-foreground font-semibold" : "text-muted-foreground"} truncate`}>{title}</p>
                <p className="text-small text-muted-foreground">{time}</p>
              </div>
              {unread && <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0" />}
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default NotificationsPage;
