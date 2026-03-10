import { Heart, Share2, MapPin } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";

const SpeciesWikiPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-24 overflow-y-auto hide-scrollbar relative">
        {/* Hero image */}
        <div className="relative h-[300px]">
          <img src={insectMantis} alt="中华螳螂" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-0 left-0 right-0">
            <PageHeader title="" transparent />
          </div>
        </div>

        <div className="px-5 -mt-12 relative z-10">
          <h1 className="text-title text-foreground">中华螳螂</h1>
          <p className="text-subtitle text-muted-foreground italic">Tenodera sinensis</p>

          {/* Basic info */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-3">基本信息</h3>
            <div className="grid grid-cols-2 gap-y-3 text-caption">
              {[
                ["目", "螳螂目"],
                ["科", "螳螂科"],
                ["属", "大刀螳属"],
                ["体长", "40-90mm"],
                ["分布", "东亚广泛分布"],
                ["保护等级", "无危 (LC)"],
              ].map(([k, v], i) => (
                <div key={i}>
                  <span className="text-muted-foreground">{k}：</span>
                  <span className="text-foreground font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Morphology */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">形态特征</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              体型较大，体色多为绿色或棕色。头部三角形，复眼大而突出。前胸背板延长，前足为典型的捕捉足，
              胫节内侧具有锐利的倒刺。翅两对，前翅革质，后翅膜质。腹部宽大扁平。
            </p>
          </div>

          {/* Habits */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">生活习性</h3>
            <p className="text-caption text-muted-foreground leading-relaxed">
              肉食性昆虫，以蝗虫、蚜虫、蝇类等为食。善于伪装，常静止不动等待猎物靠近后迅速捕获。
              雌性在交配后有时会吃掉雄性。卵鞘产于树枝上，翌年春季孵化。
            </p>
          </div>

          {/* Distribution map placeholder */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4">
            <h3 className="text-subtitle text-foreground mb-2">分布区域</h3>
            <div className="h-32 bg-secondary rounded-lg flex items-center justify-center">
              <MapPin size={24} className="text-primary" />
              <span className="text-caption text-muted-foreground ml-2">中国、日本、韩国、东南亚、北美（引入）</span>
            </div>
          </div>

          {/* Conservation */}
          <div className="bg-card rounded-xl p-4 card-shadow micro-border mt-4 mb-6">
            <h3 className="text-subtitle text-foreground mb-2">保护等级</h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary text-small font-semibold px-3 py-1 rounded-full">无危 (LC)</span>
            </div>
            <p className="text-caption text-muted-foreground leading-relaxed mt-2">
              该物种目前种群数量稳定，未被列入濒危名录。但城市化和农药使用对其栖息地造成一定影响。
            </p>
          </div>
        </div>

        {/* Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-8 flex gap-3">
          <button className="flex-1 h-[44px] bg-primary/10 text-primary rounded-lg text-btn btn-tap flex items-center justify-center gap-2">
            <Heart size={18} /> 收藏
          </button>
          <button className="flex-1 h-[44px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap flex items-center justify-center gap-2">
            <Share2 size={18} /> 分享
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SpeciesWikiPage;
