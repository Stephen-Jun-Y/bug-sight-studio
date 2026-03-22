import { AlertTriangle } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const BindPhonePage = () => {
  const { t } = useI18n();

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("绑定手机", "Bind phone")} />
        <div className="px-5 mt-4">
          <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle size={20} className="text-warning mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-small font-semibold text-foreground">暂未开放</p>
              <p className="text-small text-foreground">Not available yet</p>
              <p className="text-small text-foreground">手机号绑定功能暂未开放。</p>
              <p className="text-small text-foreground">Phone binding is not available yet.</p>
            </div>
          </div>
          <div className="bg-card rounded-xl card-shadow micro-border p-5">
            <p className="text-body text-foreground font-semibold mb-2">未来将支持手机号找回账号与安全验证。</p>
            <p className="text-small text-foreground mb-2">Future support will include phone-based account recovery and security verification.</p>
            <p className="text-small text-muted-foreground">现在暂时无法绑定、修改或解绑手机号。</p>
            <p className="text-small text-muted-foreground">For now, you cannot bind, change, or unbind a phone number here.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BindPhonePage;
