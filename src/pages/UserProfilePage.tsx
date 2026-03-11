import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectBee from "@/assets/insect-bee.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectGrasshopper from "@/assets/insect-grasshopper.jpg";
import { useState } from "react";

const UserProfilePage = () => {
  const [tab, setTab] = useState(0);
  const photos = [insectButterfly, insectMantis, insectBee, insectBeetle, insectGrasshopper, insectButterfly];

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="" />
        <div className="px-5 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-[40px]">🧑‍🔬</div>
          <h2 className="text-[20px] font-bold text-foreground mt-3">昆虫猎人</h2>
          <button className="mt-3 h-9 px-6 bg-primary text-primary-foreground rounded-full text-caption font-semibold btn-tap">关注</button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 px-5 mt-4">
          {[
            { v: "328", l: "识别" },
            { v: "56", l: "发布" },
            { v: "2.1k", l: "获赞" },
          ].map((s, i) => (
            <div key={i} className="flex-1 bg-card rounded-xl p-3 card-shadow micro-border text-center">
              <p className="text-subtitle text-foreground font-bold">{s.v}</p>
              <p className="text-small text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-5 mt-4 border-b border-border">
          {["动态", "收藏"].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className={`pb-2 text-body ${i === tab ? "text-foreground font-bold border-b-2 border-primary" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-0.5 mt-1">
          {photos.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <img src={p} alt="" className="w-full aspect-square object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default UserProfilePage;
