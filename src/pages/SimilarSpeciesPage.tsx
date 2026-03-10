import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectBeetle from "@/assets/insect-beetle.jpg";
import insectGrasshopper from "@/assets/insect-grasshopper.jpg";

const species = [
  {
    img: insectMantis,
    name: "中华螳螂",
    latin: "Tenodera sinensis",
    match: "94.7%",
    diffs: ["体长 40-90mm", "绿色/棕色", "前翅较长"],
  },
  {
    img: insectBeetle,
    name: "大刀螳螂",
    latin: "Tenodera aridifolia",
    match: "78.3%",
    diffs: ["体长 65-100mm", "多为棕色", "体型更粗壮"],
  },
  {
    img: insectGrasshopper,
    name: "广斧螳螂",
    latin: "Hierodula patellifera",
    match: "62.1%",
    diffs: ["体长 50-70mm", "翅基有斑", "前足较宽"],
  },
];

const SimilarSpeciesPage = () => {
  return (
    <MobileLayout>
      <div className="h-full bg-background pb-8 overflow-y-auto hide-scrollbar">
        <PageHeader title="相似物种" />
        <div className="px-5 mt-2 flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-4">
          {species.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex-shrink-0 w-[260px] bg-card rounded-2xl card-shadow micro-border overflow-hidden"
            >
              <img src={s.img} alt={s.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-subtitle text-foreground">{s.name}</h3>
                  <span className="text-small text-primary font-semibold">{s.match}</span>
                </div>
                <p className="text-small text-muted-foreground italic mb-3">{s.latin}</p>
                <p className="text-small text-muted-foreground font-semibold mb-1">关键差异</p>
                <ul className="space-y-1">
                  {s.diffs.map((d, di) => (
                    <li key={di} className="text-small text-muted-foreground flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SimilarSpeciesPage;
