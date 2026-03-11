import { MapPin, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const pins = [
  { name: "奥森公园", count: 12, x: "30%", y: "35%" },
  { name: "植物园", count: 8, x: "55%", y: "45%" },
  { name: "香山", count: 5, x: "20%", y: "55%" },
  { name: "颐和园", count: 15, x: "65%", y: "30%" },
  { name: "天坛", count: 3, x: "50%", y: "60%" },
];

const ObservationMapPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="h-full bg-background relative">
        <PageHeader
          title="观察地图"
          transparent
          right={
            <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
              <SlidersHorizontal size={20} className="text-foreground" />
            </button>
          }
        />
        {/* Simulated map */}
        <div className="absolute inset-0 pt-24 bg-secondary">
          <div className="relative w-full h-full" style={{ background: "linear-gradient(135deg, hsl(142 30% 90%), hsl(200 20% 88%), hsl(142 20% 85%))" }}>
            {pins.map((pin, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{ left: pin.x, top: pin.y }}
              >
                <div className="bg-primary text-primary-foreground text-small font-bold rounded-full w-8 h-8 flex items-center justify-center card-shadow">
                  {pin.count}
                </div>
                <MapPin size={24} className="text-primary -mt-1" fill="currentColor" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom card */}
        <div className="absolute bottom-8 left-4 right-4 bg-card rounded-2xl p-4 card-shadow micro-border">
          <h3 className="text-subtitle text-foreground">北京市</h3>
          <p className="text-caption text-muted-foreground">5 个观察地点 · 43 条记录</p>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 h-9 bg-primary/10 text-primary rounded-lg text-small font-semibold btn-tap">时间筛选</button>
            <button className="flex-1 h-9 bg-primary/10 text-primary rounded-lg text-small font-semibold btn-tap">物种筛选</button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ObservationMapPage;
