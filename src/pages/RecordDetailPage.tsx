import { Edit3, Trash2, Share2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";

const RecordDetailPage = () => {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-24 overflow-y-auto hide-scrollbar relative">
        {/* Image */}
        <div className="relative h-[280px]">
          <img src={insectMantis} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0">
            <PageHeader title="" transparent />
          </div>
        </div>

        <div className="px-5 -mt-8 relative z-10">
          <div className="bg-card rounded-2xl p-4 card-shadow micro-border">
            <h2 className="text-title text-foreground">中华螳螂</h2>
            <p className="text-caption text-muted-foreground italic">Tenodera sinensis</p>
            <div className="mt-4 space-y-3 text-caption">
              <div className="flex justify-between">
                <span className="text-muted-foreground">识别时间</span>
                <span className="text-foreground">2024-03-10 14:32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">置信度</span>
                <span className="text-primary font-semibold">94.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">识别地点</span>
                <span className="text-foreground flex items-center gap-1"><MapPin size={14} /> 北京·奥森公园</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">备注</h3>
            <p className="text-caption text-muted-foreground">在草丛中发现，体色为绿色，非常活跃。</p>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-8 flex gap-3">
          <button onClick={() => navigate("/edit-record")} className="flex-1 h-[44px] bg-primary/10 text-primary rounded-lg text-btn btn-tap flex items-center justify-center gap-2">
            <Edit3 size={18} /> 编辑
          </button>
          <button className="h-[44px] px-4 bg-destructive/10 text-destructive rounded-lg text-btn btn-tap flex items-center justify-center">
            <Trash2 size={18} />
          </button>
          <button className="h-[44px] px-4 bg-secondary text-foreground rounded-lg text-btn btn-tap flex items-center justify-center">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RecordDetailPage;
