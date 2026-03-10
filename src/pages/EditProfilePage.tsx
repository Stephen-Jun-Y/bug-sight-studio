import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const EditProfilePage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader title="编辑资料" right={<button className="text-caption text-primary font-semibold">保存</button>} />
        <div className="px-5 mt-4">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-secondary border-[3px] border-primary overflow-hidden">
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[48px]">🦋</div>
            </div>
            <button className="mt-2 text-caption text-primary">更换头像</button>
          </div>
          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-small text-muted-foreground mb-1 block">昵称</label>
              <input defaultValue="自然探索者" className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow" />
            </div>
            <div>
              <label className="text-small text-muted-foreground mb-1 block">简介</label>
              <textarea defaultValue="热爱自然，记录昆虫之美" rows={3} maxLength={100} className="w-full bg-card rounded-md px-4 py-3 text-body text-foreground card-shadow micro-border outline-none focus:focus-glow transition-shadow resize-none" />
              <p className="text-small text-muted-foreground text-right mt-1">14/100</p>
            </div>
            <div>
              <label className="text-small text-muted-foreground mb-1 block">所在地</label>
              <button className="w-full h-[50px] bg-card rounded-md px-4 text-body text-foreground card-shadow micro-border text-left flex items-center justify-between">
                北京
                <span className="text-muted-foreground">›</span>
              </button>
            </div>
          </div>
          <button className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap mt-8">保存修改</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EditProfilePage;
