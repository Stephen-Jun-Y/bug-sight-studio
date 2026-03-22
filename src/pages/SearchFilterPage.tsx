import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/language";

const parseHarmLevel = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const SearchFilterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, t } = useI18n();
  const [harmLevel, setHarmLevel] = useState<number | undefined>(() => parseHarmLevel(searchParams.get("harmLevel")));

  const options = useMemo(
    () => [
      { value: undefined, label: t("全部", "All") },
      { value: 1, label: language === "en-US" ? "Level 1" : "1级" },
      { value: 2, label: language === "en-US" ? "Level 2" : "2级" },
      { value: 3, label: language === "en-US" ? "Level 3" : "3级" },
      { value: 4, label: language === "en-US" ? "Level 4" : "4级" },
      { value: 5, label: language === "en-US" ? "Level 5" : "5级" },
    ],
    [language, t],
  );

  const applyFilters = () => {
    const next = new URLSearchParams();
    const keyword = searchParams.get("q")?.trim();
    if (keyword) {
      next.set("q", keyword);
    }
    if (harmLevel !== undefined) {
      next.set("harmLevel", String(harmLevel));
    }

    navigate({
      pathname: "/search",
      search: next.toString() ? `?${next.toString()}` : "",
    });
  };

  return (
    <MobileLayout>
      <div className="relative h-full overflow-y-auto hide-scrollbar bg-background pb-safe-page">
        <PageHeader title={t("筛选条件", "Filters")} />
        <div className="px-5 mt-2 space-y-6">
          <div className="bg-card rounded-xl p-4 card-shadow micro-border">
            <p className="text-subtitle text-foreground mb-2">{t("危害等级", "Harm level")}</p>
            <p className="text-small text-muted-foreground mb-3">
              {t("当前后端已支持按危害等级筛选，其他筛选项后续再接。", "The backend currently supports harm-level filtering. Other filters will be connected later.")}
            </p>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const active = option.value === harmLevel;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => setHarmLevel(option.value)}
                    aria-pressed={active}
                    className={`px-4 py-2 rounded-md text-caption card-shadow micro-border btn-tap ${
                      active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-safe-sheet flex gap-3">
          <button onClick={() => setHarmLevel(undefined)} className="flex-1 h-[44px] bg-secondary text-foreground rounded-lg text-btn btn-tap">{t("重置", "Reset")}</button>
          <button onClick={applyFilters} className="flex-1 h-[44px] bg-primary text-primary-foreground rounded-lg text-btn btn-tap">{t("应用筛选", "Apply filters")}</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SearchFilterPage;
