import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Share2, Flag, MoreHorizontal, ChevronRight, MapPin, Ruler, Sun, Shield } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import { useState } from "react";

const infoCards = [
  { icon: MapPin, label: "分布区域", value: "东亚、东南亚", color: "text-primary" },
  { icon: Ruler, label: "体长范围", value: "40-90mm", color: "text-warning" },
  { icon: Sun, label: "活跃季节", value: "5月-10月", color: "text-destructive" },
  { icon: Shield, label: "保护等级", value: "无危 (LC)", color: "text-success" },
];

const ResultPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <MobileLayout>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full bg-background overflow-y-auto hide-scrollbar pb-24"
      >
        <PageHeader title="识别结果" right={<MoreHorizontal size={22} className="text-muted-foreground" />} />

        {/* Image */}
        <div className="px-5 mt-2">
          <div className="rounded-2xl overflow-hidden card-shadow">
            <img src={insectMantis} alt="中华螳螂" className="w-full h-56 object-cover" />
          </div>
        </div>

        {/* Confidence */}
        <div className="px-5 mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-small text-muted-foreground">匹配度</span>
            <span className="text-small text-primary font-semibold">94.7%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "94.7%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Names */}
        <div className="px-5 mt-4">
          <h2 className="text-title text-foreground">中华螳螂</h2>
          <p className="text-subtitle text-muted-foreground italic">Tenodera sinensis</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 px-5 mt-4">
          {infoCards.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-xl p-3 card-shadow micro-border"
            >
              <Icon size={18} className={color} />
              <p className="text-small text-muted-foreground mt-1">{label}</p>
              <p className="text-caption text-foreground font-semibold">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <div className="px-5 mt-4">
          <div className="bg-card rounded-xl p-4 card-shadow micro-border">
            <h3 className="text-subtitle text-foreground mb-2">百科介绍</h3>
            <p className={`text-caption text-muted-foreground leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}>
              中华螳螂（学名：Tenodera sinensis），又名中华大刀螂，是螳螂目中体型较大的一种。
              体长通常为 40-90mm，体色多为绿色或棕色。善于伪装，是田间重要的益虫，
              以蝗虫、蚜虫等害虫为食。前肢为典型的捕捉足，具有强有力的倒刺。
              广泛分布于中国、日本、韩国等东亚地区，现已被引入北美。
            </p>
            <button onClick={() => setExpanded(!expanded)} className="text-primary text-caption mt-2">
              {expanded ? "收起" : "查看更多"}
            </button>
          </div>
        </div>

        {/* Similar species */}
        <div className="px-5 mt-4">
          <button onClick={() => navigate("/similar-species")} className="w-full bg-card rounded-xl p-4 card-shadow micro-border flex items-center justify-between tap-scale">
            <div>
              <p className="text-subtitle text-foreground">相似物种</p>
              <p className="text-small text-muted-foreground">查看 3 个相似物种</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Bottom actions */}
        <div className="px-5 mt-6 flex gap-3">
          {[
            { icon: Heart, label: "收藏", active: liked, onClick: () => setLiked(!liked) },
            { icon: Share2, label: "分享" },
            { icon: Flag, label: "报告" },
          ].map(({ icon: Icon, label, active, onClick }, i) => (
            <button
              key={i}
              onClick={onClick}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl btn-tap ${
                active ? "bg-primary/10 text-primary" : "bg-card card-shadow text-muted-foreground"
              }`}
            >
              <Icon size={20} fill={active ? "currentColor" : "none"} />
              <span className="text-small">{label}</span>
            </button>
          ))}
        </div>

        {/* View wiki */}
        <div className="px-5 mt-4 mb-6">
          <button
            onClick={() => navigate("/species-wiki")}
            className="w-full h-[50px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap"
          >
            查看完整百科
          </button>
        </div>
      </motion.div>
    </MobileLayout>
  );
};

export default ResultPage;
