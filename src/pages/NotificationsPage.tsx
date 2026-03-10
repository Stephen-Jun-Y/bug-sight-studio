import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, Bell as BellIcon } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const tabs = ["全部", "互动", "系统"];
const notifications = [
  { icon: Heart, color: "text-destructive", title: "昆虫猎人 赞了你的动态", time: "2分钟前", unread: true },
  { icon: MessageCircle, color: "text-primary", title: "花园守护者 评论了你的照片", time: "30分钟前", unread: true },
  { icon: UserPlus, color: "text-warning", title: "微距摄影师 关注了你", time: "1小时前", unread: true },
  { icon: BellIcon, color: "text-muted-foreground", title: "你的识别记录已达到100条！", time: "昨天", unread: false },
  { icon: BellIcon, color: "text-muted-foreground", title: "系统维护通知：3月15日凌晨2:00-4:00", time: "3天前", unread: false },
];

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="消息通知" showBack />
        <div className="flex gap-4 px-5 border-b border-border">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`pb-2 text-body relative ${i === activeTab ? "text-foreground font-bold" : "text-muted-foreground"}`}
            >
              {t}
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
