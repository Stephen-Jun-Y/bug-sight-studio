import { useState } from "react";
import { Camera, MapPin, Hash, Lock, Plus } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const PublishPage = () => {
  const [content, setContent] = useState("");

  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader
          title="发布"
          right={
            <button disabled={!content} className={`text-btn ${content ? "text-primary" : "text-muted-foreground"} btn-tap`}>
              发布
            </button>
          }
        />
        <div className="px-5 mt-2">
          {/* Media */}
          <div className="flex gap-2 mb-4">
            <div className="w-24 h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center btn-tap">
              <Plus size={24} className="text-muted-foreground" />
            </div>
          </div>

          {/* Text */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="分享你的发现..."
            maxLength={500}
            rows={6}
            className="w-full bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none resize-none"
          />
          <p className="text-small text-muted-foreground text-right">{content.length}/500</p>

          {/* Options */}
          <div className="mt-4 space-y-0 border-t border-border">
            {[
              { icon: Hash, label: "添加话题", value: "#昆虫 #自然" },
              { icon: MapPin, label: "添加位置", value: "北京·奥森公园" },
              { icon: Lock, label: "隐私设置", value: "公开" },
            ].map(({ icon: Icon, label, value }, i) => (
              <button key={i} className="w-full flex items-center justify-between py-3.5 border-b border-border tap-scale">
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-muted-foreground" />
                  <span className="text-body text-foreground">{label}</span>
                </div>
                <span className="text-caption text-muted-foreground">{value} ›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PublishPage;
