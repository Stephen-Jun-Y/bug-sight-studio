import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const SearchFilterPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-24 relative">
        <PageHeader title="筛选条件" />
        <div className="px-5 mt-2 space-y-6">
          {/* Type */}
          <div>
            <p className="text-subtitle text-foreground mb-2">物种类型</p>
            <div className="flex flex-wrap gap-2">
              {["鳞翅目", "鞘翅目", "膜翅目", "直翅目", "蜻蜓目", "半翅目"].map(t => (
                <button key={t} className="px-4 py-2 bg-card rounded-md text-caption text-foreground card-shadow micro-border btn-tap">
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Size slider */}
          <div>
            <p className="text-subtitle text-foreground mb-2">体型大小</p>
            <div className="flex items-center gap-3">
              <span className="text-small text-muted-foreground">1mm</span>
              <div className="flex-1 h-1 bg-secondary rounded-full relative">
                <div className="absolute left-[10%] right-[30%] h-full bg-primary rounded-full" />
                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-5 h-5 bg-card rounded-full card-shadow border-2 border-primary" />
                <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-5 h-5 bg-card rounded-full card-shadow border-2 border-primary" />
              </div>
              <span className="text-small text-muted-foreground">200mm</span>
            </div>
          </div>

          {/* Region */}
          <div>
            <p className="text-subtitle text-foreground mb-2">分布区域</p>
            <div className="flex flex-wrap gap-2">
              {["华北", "华东", "华南", "西南", "东北", "西北"].map(r => (
                <button key={r} className="px-4 py-2 bg-card rounded-md text-caption text-foreground card-shadow micro-border btn-tap">
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Protection */}
          <div>
            <p className="text-subtitle text-foreground mb-2">保护等级</p>
            <div className="flex flex-wrap gap-2">
              {["无危", "近危", "易危", "濒危", "极危"].map(p => (
                <button key={p} className="px-4 py-2 bg-card rounded-md text-caption text-foreground card-shadow micro-border btn-tap">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-8 flex gap-3">
          <button className="flex-1 h-[44px] bg-secondary text-foreground rounded-lg text-btn btn-tap">重置</button>
          <button className="flex-1 h-[44px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap">应用筛选</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SearchFilterPage;
