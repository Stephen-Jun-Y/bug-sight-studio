import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectBee from "@/assets/insect-bee.jpg";

const items = [
  { img: insectMantis, name: "中华螳螂", date: "3月10日" },
  { img: insectButterfly, name: "帝王蝶", date: "3月8日" },
  { img: insectBeetle, name: "锹甲", date: "3月5日" },
  { img: insectBee, name: "蜜蜂", date: "2月28日" },
];

const FavoritesPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background">
        <PageHeader title="我的收藏" right={<button className="text-caption text-primary">编辑</button>} />
        <div className="px-5 mt-2 grid grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl overflow-hidden card-shadow micro-border tap-scale"
            >
              <img src={item.img} alt={item.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-caption text-foreground font-semibold">{item.name}</p>
                <p className="text-small text-muted-foreground">{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default FavoritesPage;
