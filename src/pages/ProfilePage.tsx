import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, ChevronRight, Heart, Award, MapPin, HelpCircle, Edit3 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import { toast } from "@/components/ui/sonner";
import { clearAuth } from "@/lib/auth";
import { useI18n } from "@/lib/language";
import { getCurrentUserProfile } from "@/services/user-service";
import { listRecognitionHistory } from "@/services/recognition-service";
import type { CurrentUserProfile, RecognitionResult } from "@/types/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [history, setHistory] = useState<RecognitionResult[]>([]);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const [userProfile, recognitionHistory] = await Promise.all([
          getCurrentUserProfile(),
          listRecognitionHistory({ page: 1, pageSize: 100 }),
        ]);

        if (!active) return;

        setProfile(userProfile);
        setHistory(recognitionHistory.list);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("资料加载失败，请稍后重试", "Failed to load profile. Please try again."));
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const speciesIds = new Set<number>();
    const places = new Set<string>();
    const days = new Set<string>();

    history.forEach(record => {
      if (record.species?.id !== undefined) {
        speciesIds.add(record.species.id);
      }

      const location = record.location?.trim();
      if (location) {
        places.add(location);
      }

      const day = record.capturedAt?.split("T")[0];
      if (day) {
        days.add(day);
      }
    });

    return [
      { value: String(speciesIds.size), label: t("物种", "Species") },
      { value: String(places.size), label: t("地点", "Places") },
      { value: String(days.size), label: t("天数", "Days") },
    ];
  }, [history, t]);

  const speciesCount = stats[0]?.value ?? "0";

  const menuGroups = [
    [
      { icon: Heart, label: t("我的收藏", "Favorites"), path: "/favorites" },
      { icon: Award, label: t("成就徽章", "Achievements"), path: "/achievements" },
      { icon: MapPin, label: t("观察地图", "Observation map"), path: "/observation-map" },
    ],
    [
      { icon: Settings, label: t("设置", "Settings"), path: "/settings" },
      { icon: HelpCircle, label: t("帮助与反馈", "Help & feedback"), path: "/help" },
    ],
  ];

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="flex items-center justify-between px-5 pt-1">
          <h1 className="text-display text-foreground">{t("我的", "Me")}</h1>
          <button onClick={() => navigate("/settings")} className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Settings size={22} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 mt-4">
          <div className="bg-card rounded-2xl p-5 card-shadow micro-border text-center">
            <div className="w-20 h-20 rounded-full mx-auto bg-secondary border-[3px] border-primary overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[36px]">🦋</div>
            </div>
            <h2 className="text-[20px] font-bold text-foreground mt-3">{profile?.nickname || t("自然探索者", "Nature explorer")}</h2>
            <p className="text-caption text-tertiary-40 mt-1">
              {t(`已识别 ${speciesCount} 种昆虫`, `${speciesCount} insects identified`)}
            </p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-3 text-caption text-primary flex items-center gap-1 mx-auto"
            >
              <Edit3 size={14} /> {t("编辑资料", "Edit profile")}
            </button>
          </div>
        </div>

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

        {menuGroups.map((group, gi) => (
          <div key={gi} className="px-5 mt-4">
            <div className="bg-card rounded-xl card-shadow micro-border overflow-hidden">
              {group.map(({ icon: Icon, label, path }, i) => (
                <button
                  key={i}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 tap-scale border-b border-border last:border-0"
                >
                  <Icon size={20} className="text-primary" />
                  <span className="flex-1 text-body text-foreground text-left">{label}</span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="px-5 mt-6">
          <button
            onClick={() => {
              clearAuth();
              navigate("/auth", { replace: true });
            }}
            className="w-full text-center py-3 text-body text-destructive btn-tap"
          >
            {t("退出登录", "Sign out")}
          </button>
        </div>
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default ProfilePage;
