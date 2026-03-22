import { MapPin, SlidersHorizontal } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const ObservationMapPage = () => {
  const { t } = useI18n();

  const pins = [
    { name: t("奥森公园", "Olympic Forest Park"), count: 12, x: "30%", y: "35%" },
    { name: t("植物园", "Botanical Garden"), count: 8, x: "55%", y: "45%" },
    { name: t("香山", "Fragrant Hills"), count: 5, x: "20%", y: "55%" },
    { name: t("颐和园", "Summer Palace"), count: 15, x: "65%", y: "30%" },
    { name: t("天坛", "Temple of Heaven"), count: 3, x: "50%", y: "60%" },
  ];

  return (
    <MobileLayout>
      <div className="h-full bg-background relative">
        <PageHeader
          title={t("观察地图", "Observation map")}
          transparent
          right={
            <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
              <SlidersHorizontal size={20} className="text-foreground" />
            </button>
          }
        />
        <div className="absolute inset-0 pt-24 bg-secondary">
          <div className="relative w-full h-full" style={{ background: "linear-gradient(135deg, hsl(142 30% 90%), hsl(200 20% 88%), hsl(142 20% 85%))" }}>
            {pins.map((pin, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{ left: pin.x, top: pin.y }}
                aria-label={pin.name}
              >
                <div className="bg-primary text-primary-foreground text-small font-bold rounded-full w-8 h-8 flex items-center justify-center card-shadow">
                  {pin.count}
                </div>
                <MapPin size={24} className="text-primary -mt-1" fill="currentColor" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-4 right-4 bg-card rounded-2xl p-4 card-shadow micro-border">
          <h3 className="text-subtitle text-foreground">{t("北京市", "Beijing")}</h3>
          <p className="text-caption text-muted-foreground">{t("5 个观察地点 · 43 条记录", "5 observation spots · 43 records")}</p>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 h-9 bg-primary/10 text-primary rounded-lg text-small font-semibold btn-tap">{t("时间筛选", "Filter by time")}</button>
            <button className="flex-1 h-9 bg-primary/10 text-primary rounded-lg text-small font-semibold btn-tap">{t("物种筛选", "Filter by species")}</button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ObservationMapPage;
