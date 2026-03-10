import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import onboarding1 from "@/assets/onboarding-1.jpg";
import onboarding2 from "@/assets/onboarding-2.jpg";
import onboarding3 from "@/assets/onboarding-3.jpg";

const slides = [
  { img: onboarding1, title: "探索昆虫世界", desc: "用手机相机即刻识别身边的昆虫，开启自然探索之旅" },
  { img: onboarding2, title: "AI 智能识别", desc: "基于深度学习的识别引擎，覆盖 10,000+ 昆虫物种" },
  { img: onboarding3, title: "记录与分享", desc: "建立你的昆虫图鉴，与全球自然爱好者交流" },
];

const OnboardingPage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < 2) setCurrent(current + 1);
    else navigate("/auth");
  };

  return (
    <MobileLayout>
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img src={slides[current].img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Skip button */}
        <button
          onClick={() => navigate("/auth")}
          className="absolute top-14 right-5 z-10 text-caption font-normal text-primary-foreground/70 btn-tap"
        >
          跳过
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-[28px] font-bold text-primary-foreground mb-2">{slides[current].title}</h2>
              <p className="text-body text-primary-foreground/70 mb-8">{slides[current].desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots + Button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-primary-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-btn btn-tap"
            >
              {current === 2 ? "开始探索" : "下一步"}
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default OnboardingPage;
