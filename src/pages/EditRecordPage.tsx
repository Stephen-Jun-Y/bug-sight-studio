import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const EditRecordPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader title="编辑记录" />
        <div className="px-5 mt-4 space-y-4">
          <div>
            <label className="text-small text-muted-foreground mb-1 block">备注</label>
            <textarea defaultValue="在草丛中发现，体色为绿色，非常活跃。" rows={4} className="w-full bg-card rounded-md px-4 py-3 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow resize-none" />
          </div>
          <div>
            <label className="text-small text-muted-foreground mb-1 block">地点</label>
            <button className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border text-left flex items-center justify-between">
              北京·奥森公园
              <span className="text-muted-foreground">›</span>
            </button>
          </div>
          <div>
            <label className="text-small text-muted-foreground mb-1 block">时间</label>
            <button className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border text-left flex items-center justify-between">
              2024-03-10 14:32
              <span className="text-muted-foreground">›</span>
            </button>
          </div>
          <div className="flex gap-3 pt-4">
            <button className="flex-1 h-[50px] bg-secondary text-foreground rounded-lg text-btn btn-tap">取消</button>
            <button className="flex-1 h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap">保存</button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EditRecordPage;
