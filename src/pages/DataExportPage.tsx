import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, CheckCircle, Share2 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

type ExportState = "config" | "exporting" | "done";

const DataExportPage = () => {
  const [format, setFormat] = useState(0);
  const [timeRange, setTimeRange] = useState(0);
  const [selected, setSelected] = useState([true, true, false]);
  const [exportState, setExportState] = useState<ExportState>("config");
  const [progress, setProgress] = useState(0);
  const { t } = useI18n();

  const formats = ["JSON", "CSV", "PDF"];
  const timeRanges = [t("全部数据", "All data"), t("最近 30 天", "Last 30 days"), t("自定义", "Custom")];
  const contentTypes = [
    { label: t("识别记录", "Recognition history"), desc: t("所有昆虫识别历史", "All insect recognition records") },
    { label: t("收藏数据", "Favorites"), desc: t("收藏的物种与记录", "Favorited species and records") },
    { label: t("个人信息", "Profile data"), desc: t("账号资料与设置", "Account profile and settings") },
  ];

  const toggleContent = (i: number) => {
    const next = [...selected];
    next[i] = !next[i];
    setSelected(next);
  };

  const handleExport = () => {
    setExportState("exporting");
    setProgress(0);
    const start = Date.now();
    const duration = 3000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p * 100);
      if (p < 1) requestAnimationFrame(tick);
      else setExportState("done");
    };
    requestAnimationFrame(tick);
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-safe-sheet overflow-y-auto hide-scrollbar">
        <PageHeader title={t("数据导出", "Data export")} />

        <AnimatePresence mode="wait">
          {exportState === "config" && (
            <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 mt-2">
              <div className="bg-primary/10 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <FileDown size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-caption text-foreground font-semibold">{t("导出您的数据", "Export your data")}</p>
                    <p className="text-small text-muted-foreground mt-1">{t("您可以导出应用中的个人数据，包括识别记录、收藏和个人信息。数据将以您选择的格式打包下载。", "Export your personal data, including recognition history, favorites, and profile information. The app will package it in your selected format.")}</p>
                  </div>
                </div>
              </div>

              <p className="text-small text-muted-foreground mb-2 uppercase tracking-wider">{t("导出格式", "Format")}</p>
              <div className="flex gap-2 mb-5">
                {formats.map((item, i) => (
                  <button
                    key={item}
                    onClick={() => setFormat(i)}
                    className={`flex-1 h-10 rounded-xl text-caption font-semibold btn-tap transition-colors ${
                      format === i ? "bg-primary text-primary-foreground" : "bg-card text-foreground card-shadow micro-border"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <p className="text-small text-muted-foreground mb-2 uppercase tracking-wider">{t("时间范围", "Time range")}</p>
              <div className="bg-card rounded-xl card-shadow micro-border overflow-hidden mb-5">
                {timeRanges.map((item, i) => (
                  <button
                    key={item}
                    onClick={() => setTimeRange(i)}
                    className="w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
                  >
                    <span className="text-body text-foreground">{item}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      timeRange === i ? "border-primary" : "border-muted-foreground/30"
                    }`}>
                      {timeRange === i && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-small text-muted-foreground mb-2 uppercase tracking-wider">{t("导出内容", "Content")}</p>
              <div className="bg-card rounded-xl card-shadow micro-border overflow-hidden mb-6">
                {contentTypes.map((content, i) => (
                  <button
                    key={content.label}
                    onClick={() => toggleContent(i)}
                    className="w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-body text-foreground text-left">{content.label}</p>
                      <p className="text-small text-muted-foreground">{content.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center ${
                      selected[i] ? "bg-primary" : "border-2 border-muted-foreground/30"
                    }`}>
                      {selected[i] && <span className="text-primary-foreground text-[11px] font-bold">✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleExport}
                disabled={!selected.some(Boolean)}
                className="w-full h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap disabled:opacity-40"
              >
                {t("开始导出", "Start export")}
              </button>
            </motion.div>
          )}

          {exportState === "exporting" && (
            <motion.div key="exporting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 mt-20 text-center">
              <motion.div
                className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-body text-foreground font-semibold mt-6">{t("正在导出数据...", "Exporting data...")}</p>
              <div className="w-48 h-1.5 bg-secondary rounded-full mx-auto mt-4 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-small text-muted-foreground mt-2">
                {t(`预计剩余 ${Math.max(0, Math.ceil((100 - progress) / 33))} 秒`, `${Math.max(0, Math.ceil((100 - progress) / 33))} seconds remaining`)}
              </p>
            </motion.div>
          )}

          {exportState === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-5 mt-20 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <CheckCircle size={40} className="text-primary" />
              </div>
              <p className="text-title text-foreground mt-4">{t("导出完成！", "Export complete!")}</p>
              <p className="text-caption text-muted-foreground mt-2">{t(`文件大小：2.4 MB · ${formats[format]} 格式`, `File size: 2.4 MB · ${formats[format]} format`)}</p>
              <div className="flex gap-3 mt-8">
                <button className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl text-body font-semibold btn-tap">
                  {t("保存文件", "Save file")}
                </button>
                <button className="h-12 w-12 bg-card rounded-xl card-shadow micro-border flex items-center justify-center btn-tap">
                  <Share2 size={20} className="text-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default DataExportPage;
