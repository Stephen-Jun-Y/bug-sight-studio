import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";
import { toast } from "@/components/ui/sonner";
import { changeCurrentUserPassword } from "@/services/user-service";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();

  const getStrength = (pw: string): { level: number; label: string; color: string } => {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: t("太简单", "Too weak"), color: "bg-destructive" };
    if (score <= 2) return { level: 2, label: t("还可以", "Good"), color: "bg-warning" };
    return { level: 3, label: t("很安全", "Strong"), color: "bg-primary" };
  };

  const strength = getStrength(newPw);
  const meetsPasswordPolicy =
    newPw.length >= 8 &&
    /[A-Z]/.test(newPw) &&
    /[a-z]/.test(newPw) &&
    /\d/.test(newPw);
  const valid = current.length > 0 && meetsPasswordPolicy && newPw === confirm;

  const handleSubmit = async () => {
    if (!valid || submitting) return;

    try {
      setSubmitting(true);
      await changeCurrentUserPassword({
        currentPassword: current,
        newPassword: newPw,
      });
      toast.success(t("密码已更新", "Password updated"));
      navigate("/settings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("修改密码失败，请稍后重试", "Failed to change password. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("修改密码", "Change password")} />
        <div className="px-5 mt-4 space-y-5">
          <div>
            <label htmlFor="current-password" className="text-small text-muted-foreground mb-1.5 block">
              {t("当前密码", "Current password")}
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder={t("请输入当前密码", "Enter your current password")}
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showCurrent ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="text-small text-muted-foreground mb-1.5 block">
              {t("新密码", "New password")}
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder={t("至少 8 位，含大小写字母和数字", "At least 8 characters with upper/lowercase letters and numbers")}
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showNew ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
            {newPw && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i <= strength.level ? strength.color : "bg-secondary"}`} />
                  ))}
                </div>
                <p className={`text-small mt-1 ${strength.level === 1 ? "text-destructive" : strength.level === 2 ? "text-warning" : "text-primary"}`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="text-small text-muted-foreground mb-1.5 block">
              {t("确认新密码", "Confirm new password")}
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={t("再次输入新密码", "Enter the new password again")}
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showConfirm ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
            {confirm && confirm !== newPw && (
              <p className="text-small text-destructive mt-1">{t("两次输入的密码不一致", "Passwords do not match")}</p>
            )}
          </div>

          <div className="bg-secondary rounded-xl p-4">
            <p className="text-small text-muted-foreground font-semibold mb-2">{t("密码要求：", "Password rules:")}</p>
            <ul className="space-y-1">
              {[
                { text: t("至少 8 个字符", "At least 8 characters"), ok: newPw.length >= 8 },
                { text: t("包含大写字母", "Contains uppercase letters"), ok: /[A-Z]/.test(newPw) },
                { text: t("包含小写字母", "Contains lowercase letters"), ok: /[a-z]/.test(newPw) },
                { text: t("包含数字", "Contains numbers"), ok: /\d/.test(newPw) },
              ].map((rule, i) => (
                <li key={i} className={`text-small flex items-center gap-2 ${rule.ok ? "text-primary" : "text-muted-foreground"}`}>
                  <span>{rule.ok ? "✓" : "○"}</span> {rule.text}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleSubmit} disabled={!valid || submitting} className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap disabled:opacity-40 mt-4">
            {submitting ? t("提交中...", "Submitting...") : t("确认修改", "Update password")}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ChangePasswordPage;
