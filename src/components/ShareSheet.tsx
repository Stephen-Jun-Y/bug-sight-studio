import { motion, AnimatePresence } from "framer-motion";
import { X, Link2, Download, MoreHorizontal } from "lucide-react";

const shareOptions = [
  { icon: "💬", label: "微信" },
  { icon: "🐧", label: "QQ" },
  { icon: "🔴", label: "微博" },
  { icon: <Link2 size={24} />, label: "复制链接", isIcon: true },
  { icon: <Download size={24} />, label: "保存相册", isIcon: true },
  { icon: <MoreHorizontal size={24} />, label: "更多", isIcon: true },
];

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
}

const ShareSheet = ({ open, onClose }: ShareSheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 z-40"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 pb-8"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-subtitle text-foreground font-bold">分享到</span>
              <button onClick={onClose} className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 px-5 py-5">
              {shareOptions.map((opt, i) => (
                <button key={i} className="flex flex-col items-center gap-2 btn-tap" onClick={onClose}>
                  <div className="w-[60px] h-[60px] bg-secondary rounded-2xl flex items-center justify-center text-[28px]">
                    {typeof opt.icon === "string" ? opt.icon : <span className="text-foreground">{opt.icon}</span>}
                  </div>
                  <span className="text-small text-muted-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
            <button onClick={onClose} className="mx-5 w-[calc(100%-40px)] h-11 bg-secondary text-foreground rounded-xl text-body font-semibold btn-tap">
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareSheet;
