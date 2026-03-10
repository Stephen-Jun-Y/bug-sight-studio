import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="pt-20 px-6 pb-8 h-full flex flex-col bg-card">
        {/* Logo area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[32px]">🦋</span>
          </div>
          <h1 className="text-title text-foreground">昆虫识别</h1>
          <p className="text-caption text-secondary-60 mt-1">探索自然，认识昆虫</p>
        </motion.div>

        {/* Segmented control */}
        <div className="relative bg-secondary rounded-md p-1 flex mb-8">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-card rounded-sm card-shadow"
            animate={{ x: isLogin ? 0 : "calc(100% + 4px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          />
          {["登录", "注册"].map((label, i) => (
            <button
              key={label}
              className={`relative z-10 flex-1 py-2 text-btn transition-colors ${
                (i === 0 ? isLogin : !isLogin) ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsLogin(i === 0)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.div key={isLogin ? "login" : "register"} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 flex-1">
          {!isLogin && (
            <input
              type="text"
              placeholder="昵称"
              className="w-full h-[50px] bg-secondary rounded-md px-4 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
            />
          )}
          <input
            type="email"
            placeholder="邮箱"
            className="w-full h-[50px] bg-secondary rounded-md px-4 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
          />
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="密码"
              className="w-full h-[50px] bg-secondary rounded-md px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
            />
            <button onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isLogin && (
            <button className="text-caption text-primary self-end block ml-auto">忘记密码？</button>
          )}

          {!isLogin && (
            <label className="flex items-start gap-2 text-small text-muted-foreground">
              <input type="checkbox" className="mt-0.5 accent-primary" />
              <span>我已阅读并同意《用户协议》和《隐私政策》</span>
            </label>
          )}

          <button
            onClick={() => navigate("/home")}
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap mt-4"
          >
            {isLogin ? "登录" : "注册"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-small text-muted-foreground">其他方式</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Third-party */}
          <div className="flex gap-4">
            <button className="flex-1 h-[50px] bg-foreground text-background rounded-lg text-btn btn-tap flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" /></svg>
              Apple
            </button>
            <button className="flex-1 h-[50px] bg-secondary text-foreground rounded-lg text-btn btn-tap flex items-center justify-center gap-2 border border-border">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default AuthPage;
