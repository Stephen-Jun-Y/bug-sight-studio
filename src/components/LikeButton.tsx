import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
  initialCount: number;
  initialLiked?: boolean;
  showCount?: boolean;
  size?: number;
}

const LikeButton = ({ initialCount, initialLiked = false, showCount = true, size = 18 }: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [particles, setParticles] = useState<number[]>([]);

  const toggle = useCallback(() => {
    if (!liked) {
      // Spawn particles
      setParticles(Array.from({ length: 6 }, (_, i) => i));
      setTimeout(() => setParticles([]), 600);
    }
    setLiked(l => !l);
    setCount(c => liked ? c - 1 : c + 1);
  }, [liked]);

  return (
    <button onClick={toggle} className="relative flex items-center gap-1.5 btn-tap min-w-[44px] min-h-[44px] justify-center">
      <div className="relative">
        <motion.div
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={size}
            className={liked ? "text-destructive" : "text-muted-foreground"}
            fill={liked ? "currentColor" : "none"}
          />
        </motion.div>
        {/* Particles */}
        <AnimatePresence>
          {particles.map(i => {
            const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
            const dist = 16 + Math.random() * 8;
            return (
              <motion.div
                key={`${i}-${Date.now()}`}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist - 10,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <Heart size={8} className="text-destructive" fill="currentColor" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {showCount && <span className={`text-small ${liked ? "text-destructive" : "text-muted-foreground"}`}>{count}</span>}
    </button>
  );
};

export default LikeButton;
