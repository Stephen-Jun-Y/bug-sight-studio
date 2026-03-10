import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Image, RotateCcw, X, Zap } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";

const ScanPage = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleCapture = () => {
    setScanning(true);
    setTimeout(() => navigate("/result"), 2000);
  };

  return (
    <MobileLayout>
      <div className="relative h-full bg-foreground">
        {/* Simulated camera */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/90 to-foreground" />

        {/* Close */}
        <button onClick={() => navigate(-1)} className="absolute top-14 left-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
          <X size={24} className="text-primary-foreground" />
        </button>

        {/* Flash */}
        <button className="absolute top-14 right-5 z-20 btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Zap size={22} className="text-primary-foreground" />
        </button>

        {/* Viewfinder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[200px] h-[200px]">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-8 h-8 border-primary-foreground ${cls}`} />
            ))}
            {scanning && (
              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-lg"
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          {!scanning && (
            <p className="absolute mt-60 text-caption text-primary-foreground/60">将昆虫置于取景框内</p>
          )}
        </div>

        {/* Scanning state */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-32 left-0 right-0 text-center"
            >
              <div className="w-48 h-1 bg-primary-foreground/20 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              </div>
              <p className="text-caption text-primary-foreground/80 mt-3">正在识别...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom toolbar */}
        <div className="absolute bottom-0 left-0 right-0 glass-dark pb-8 pt-4">
          <div className="flex items-center justify-around px-8">
            <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Image size={26} className="text-primary-foreground" />
            </button>
            <button
              onClick={handleCapture}
              disabled={scanning}
              className="w-[72px] h-[72px] rounded-full border-4 border-primary-foreground/80 flex items-center justify-center btn-tap"
            >
              <div className={`w-[58px] h-[58px] rounded-full ${scanning ? "bg-destructive" : "bg-primary-foreground/90"} transition-colors`} />
            </button>
            <button className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
              <RotateCcw size={24} className="text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ScanPage;
