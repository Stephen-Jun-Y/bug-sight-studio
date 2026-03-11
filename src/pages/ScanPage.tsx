import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Image, RotateCcw, X, Zap } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import insectBee from "@/assets/insect-bee.jpg";

type ScanState = "camera" | "preview" | "scanning";

const ScanPage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ScanState>("camera");
  const [progress, setProgress] = useState(0);

  const handleCapture = () => {
    setState("preview");
  };

  const handleRetake = () => {
    setState("camera");
    setProgress(0);
  };

  const handleConfirm = () => {
    setState("scanning");
    setProgress(0);
    const start = Date.now();
    const duration = 2500;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p * 100);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => navigate("/result"), 300);
      }
    };
    requestAnimationFrame(tick);
  };

  const handleCancel = () => {
    setState("camera");
    setProgress(0);
  };

  return (
    <MobileLayout>
      <div className="relative h-full bg-foreground">
        {/* Simulated camera / photo */}
        {state === "camera" && (
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground" />
        )}

        {(state === "preview" || state === "scanning") && (
          <div className="absolute inset-0">
            <img src={insectBee} alt="captured" className={`w-full h-full object-cover ${state === "scanning" ? "brightness-50" : ""} transition-all duration-300`} />
          </div>
        )}

        {/* Close */}
        <button onClick={() => navigate(-1)} className="absolute top-14 left-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
          <X size={24} className="text-primary-foreground" />
        </button>

        {/* Flash - only in camera mode */}
        {state === "camera" && (
          <button className="absolute top-14 right-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Zap size={22} className="text-primary-foreground" />
          </button>
        )}

        {/* State 1: Camera viewfinder */}
        {state === "camera" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[200px] h-[200px]">
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-8 h-8 border-primary-foreground ${cls}`} />
                ))}
              </div>
              <p className="absolute mt-60 text-caption text-primary-foreground/60">将昆虫置于取景框内</p>
            </div>

            {/* Bottom toolbar */}
            <div className="absolute bottom-0 left-0 right-0 glass-dark pb-8 pt-4">
              <div className="flex items-center justify-around px-8">
                <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Image size={26} className="text-primary-foreground" />
                </button>
                <button
                  onClick={handleCapture}
                  className="w-[72px] h-[72px] rounded-full border-4 border-primary-foreground/80 flex items-center justify-center btn-tap"
                >
                  <div className="w-[58px] h-[58px] rounded-full bg-primary-foreground/90" />
                </button>
                <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <RotateCcw size={24} className="text-primary-foreground" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* State 2: Photo preview with confirm/retake */}
        <AnimatePresence>
          {state === "preview" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 glass-dark pb-10 pt-6 px-8"
            >
              <p className="text-center text-caption text-primary-foreground/70 mb-4">确认使用这张照片进行识别？</p>
              <div className="flex gap-4">
                <button
                  onClick={handleRetake}
                  className="flex-1 h-12 rounded-xl bg-primary-foreground/20 text-primary-foreground font-semibold text-body btn-tap flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  重拍
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-body btn-tap flex items-center justify-center gap-2"
                >
                  ✓ 确认识别
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State 3: Scanning */}
        <AnimatePresence>
          {state === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
              {/* Pulsing ring */}
              <div className="relative w-24 h-24 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-[3px] border-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-[2px] border-primary/60"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.2, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <motion.div
                    className="w-4 h-4 rounded-full bg-primary"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>

              <p className="text-body text-primary-foreground font-semibold mb-2">正在识别中...</p>

              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-small text-primary-foreground/50 mt-2">{Math.round(progress)}%</p>

              {/* Cancel button */}
              <button
                onClick={handleCancel}
                className="mt-8 px-6 h-10 rounded-full bg-primary-foreground/20 text-primary-foreground text-caption btn-tap"
              >
                取消
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default ScanPage;
