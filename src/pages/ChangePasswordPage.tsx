import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const getStrength = (pw: string): { level: number; label: string; color: string } => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "太简单", color: "bg-destructive" };
  if (score <= 2) return { level: 2, label: "还可以", color: "bg-warning" };
  return { level: 3, label: "很安全", color: "bg-primary" };
};

const ChangePasswordPage = () => {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(newPw);
  const valid = current.length > 0 && newPw.length >= 8 && newPw === confirm && strength.level >= 2;

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="修改密码" />
        <div className="px-5 mt-4 space-y-5">
          {/* Current password */}
          <div>
            <label className="text-small text-muted-foreground mb-1.5 block">当前密码</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="请输入当前密码"
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showCurrent ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-small text-muted-foreground mb-1.5 block">新密码</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="至少 8 位，含大小写字母和数字"
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showNew ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
            {/* Strength indicator */}
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

          {/* Confirm password */}
          <div>
            <label className="text-small text-muted-foreground mb-1.5 block">确认新密码</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="再次输入新密码"
                className="w-full h-[50px] bg-card rounded-[10px] px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow transition-shadow"
              />
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-tap p-1">
                {showConfirm ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
              </button>
            </div>
            {confirm && confirm !== newPw && (
              <p className="text-small text-destructive mt-1">两次输入的密码不一致</p>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-small text-muted-foreground font-semibold mb-2">密码要求：</p>
            <ul className="space-y-1">
              {[
                { text: "至少 8 个字符", ok: newPw.length >= 8 },
                { text: "包含大写字母", ok: /[A-Z]/.test(newPw) },
                { text: "包含小写字母", ok: /[a-z]/.test(newPw) },
                { text: "包含数字", ok: /\d/.test(newPw) },
              ].map((r, i) => (
                <li key={i} className={`text-small flex items-center gap-2 ${r.ok ? "text-primary" : "text-muted-foreground"}`}>
                  <span>{r.ok ? "✓" : "○"}</span> {r.text}
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled={!valid}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap disabled:opacity-40 mt-4"
          >
            确认修改
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ChangePasswordPage;
