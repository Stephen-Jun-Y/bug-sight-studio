import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { login, register } from "@/services/auth-service";
import { saveAuth } from "@/lib/auth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (submitting) return;
    setError("");

    if (!email || !password) {
      setError("请填写邮箱和密码");
      return;
    }

    if (!isLogin && (!nickname || !agreePolicy)) {
      setError("注册需要填写昵称并同意协议");
      return;
    }

    try {
      setSubmitting(true);
      const payload = isLogin
        ? await login({ email, password })
        : await register({ nickname, email, password, agreePolicy });

      saveAuth(payload);
      navigate("/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="pt-20 px-6 pb-8 h-full flex flex-col bg-card">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[32px]">🦋</span>
          </div>
          <h1 className="text-title text-foreground">昆虫识别</h1>
          <p className="text-caption text-secondary-60 mt-1">探索自然，认识昆虫</p>
        </motion.div>

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

        <motion.div key={isLogin ? "login" : "register"} initial={{ opacity: 0, x: isLogin ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 flex-1">
          {!isLogin && (
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="昵称"
              className="w-full h-[50px] bg-secondary rounded-md px-4 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="邮箱"
            className="w-full h-[50px] bg-secondary rounded-md px-4 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
          />
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full h-[50px] bg-secondary rounded-md px-4 pr-12 text-body text-foreground placeholder:text-muted-foreground outline-none focus:focus-glow transition-shadow"
            />
            <button onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {isLogin && <button className="text-caption text-primary self-end block ml-auto">忘记密码？</button>}

          {!isLogin && (
            <label className="flex items-start gap-2 text-small text-muted-foreground">
              <input type="checkbox" checked={agreePolicy} onChange={e => setAgreePolicy(e.target.checked)} className="mt-0.5 accent-primary" />
              <span>我已阅读并同意《用户协议》和《隐私政策》</span>
            </label>
          )}

          {error && <p className="text-small text-destructive">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap mt-4 disabled:opacity-50"
          >
            {submitting ? "提交中..." : isLogin ? "登录" : "注册"}
          </button>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default AuthPage;
