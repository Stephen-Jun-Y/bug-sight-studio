import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectBee from "@/assets/insect-bee.jpg";

const groups = [
  {
    label: "今天",
    items: [
      { img: insectMantis, name: "中华螳螂", time: "14:32", location: "北京·奥森公园", confidence: "94.7%" },
      { img: insectButterfly, name: "帝王蝶", time: "10:15", location: "北京·植物园", confidence: "89.2%" },
    ],
  },
  {
    label: "昨天",
    items: [
      { img: insectBeetle, name: "锹甲", time: "18:45", location: "北京·香山", confidence: "91.3%" },
    ],
  },
  {
    label: "3月7日",
    items: [
      { img: insectBee, name: "蜜蜂", time: "09:20", location: "北京·颐和园", confidence: "96.1%" },
    ],
  },
];

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="pt-14 pb-24 bg-background">
        <div className="px-5 pt-4">
          <h1 className="text-display text-foreground mb-4">历史记录</h1>
          {/* Search */}
          <button onClick={() => navigate("/search")} className="w-full h-[44px] bg-card glass rounded-md px-4 flex items-center gap-2 tap-scale">
            <Search size={18} className="text-muted-foreground" />
            <span className="text-body text-muted-foreground">搜索记录</span>
          </button>
        </div>

        {groups.map((group, gi) => (
          <div key={gi} className="mt-5">
            <p className="px-5 text-caption text-muted-foreground font-semibold mb-2">{group.label}</p>
            <div className="px-5 space-y-2">
              {group.items.map((item, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/record-detail")}
                  className="w-full bg-card rounded-xl p-3 card-shadow micro-border flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.1 + i * 0.05 }}
                >
                  <img src={item.img} alt={item.name} className="w-[60px] h-[60px] rounded-sm object-cover flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-body text-foreground font-bold truncate">{item.name}</p>
                    <p className="text-small text-tertiary-40 truncate">{item.time} · {item.location}</p>
                    <p className="text-small text-primary">{item.confidence} 匹配</p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default HistoryPage;
