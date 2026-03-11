import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";

const BindPhonePage = () => {
  const [bound] = useState(true); // simulate already bound
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const startCountdown = useCallback(() => {
    setCountdown(60);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (bound) {
    return (
      <MobileLayout>
        <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
          <PageHeader title="绑定手机" />
          <div className="px-5 mt-4">
            {/* Warning card */}
            <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertTriangle size={20} className="text-warning mt-0.5 flex-shrink-0" />
              <p className="text-small text-foreground">手机号是您找回账号的重要凭证，更换手机号需要验证当前手机。</p>
            </div>

            {/* Current phone */}
            <div className="bg-card rounded-xl card-shadow micro-border p-5 text-center">
              <p className="text-small text-muted-foreground mb-2">当前绑定手机号</p>
              <p className="text-title text-foreground font-bold tracking-wider">138****1234</p>
            </div>

            <button className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap mt-6">
              更换手机号
            </button>
            <button className="w-full text-center py-3 text-body text-destructive btn-tap mt-2">
              解除绑定
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="绑定手机" />
        <div className="px-5 mt-4">
          {/* Warning */}
          <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle size={20} className="text-warning mt-0.5 flex-shrink-0" />
            <p className="text-small text-foreground">绑定手机号可用于账号找回和安全验证。</p>
          </div>

          {/* Phone input */}
          <label className="text-small text-muted-foreground mb-1.5 block">手机号码</label>
          <div className="flex gap-2 mb-4">
            <div className="h-[50px] bg-card rounded-[10px] px-3 flex items-center card-shadow micro-border">
              <span className="text-body text-foreground">+86</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="flex-1 h-[50px] bg-card rounded-[10px] px-4 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow"
            />
          </div>

          {/* Verification code */}
          <label className="text-small text-muted-foreground mb-1.5 block">验证码</label>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="6 位验证码"
              className="flex-1 h-[50px] bg-card rounded-[10px] px-4 text-body text-foreground placeholder:text-muted-foreground outline-none card-shadow micro-border focus:focus-glow"
            />
            <button
              onClick={startCountdown}
              disabled={countdown > 0 || phone.length < 11}
              className="h-[50px] px-4 bg-primary/10 text-primary rounded-[10px] text-small font-semibold btn-tap disabled:opacity-40 whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : "获取验证码"}
            </button>
          </div>

          <button
            disabled={code.length < 6}
            className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap disabled:opacity-40"
          >
            确认绑定
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BindPhonePage;
