import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, Clock, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import { useI18n } from "@/lib/language";
import { searchSpecies } from "@/services/species-service";
import type { InsectInfo } from "@/types/api";

const parseHarmLevel = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<InsectInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { language, t } = useI18n();

  const query = searchParams.get("q") ?? "";
  const harmLevel = parseHarmLevel(searchParams.get("harmLevel"));
  const keyword = query.trim();

  const updateQuery = (nextQuery: string) => {
    const next = new URLSearchParams(searchParams);
    const trimmed = nextQuery.trim();
    if (trimmed) {
      next.set("q", nextQuery);
    } else {
      next.delete("q");
    }
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (!keyword && harmLevel === undefined) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    searchSpecies({
      ...(keyword ? { q: keyword } : {}),
      ...(harmLevel !== undefined ? { harmLevel } : {}),
      page: 1,
      pageSize: 20,
    })
      .then((data) => {
        if (cancelled) return;
        setResults(data.list);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResults([]);
        setError(err instanceof Error ? err.message : t("搜索失败，请稍后重试", "Search failed. Please try again later."));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [harmLevel, keyword, t]);

  const hotTags = [t("蝴蝶", "Butterfly"), t("甲虫", "Beetle"), t("蜻蜓", "Dragonfly"), t("螳螂", "Mantis"), t("蜜蜂", "Bee"), t("蚂蚁", "Ant"), t("蝉", "Cicada"), t("萤火虫", "Firefly")];
  const historyItems = [t("帝王蝶", "Monarch butterfly"), t("中华螳螂", "Chinese mantis"), t("七星瓢虫", "Seven-spotted ladybird")];

  const renderMeta = (item: InsectInfo) => {
    if (language === "en-US") {
      return [item.orderName, item.familyName].filter(Boolean).join(" · ") || item.speciesNameEn;
    }
    return [item.orderNameCn || item.orderName, item.familyNameCn || item.familyName].filter(Boolean).join(" · ") || item.speciesNameCn;
  };

  const activeFilterLabel = useMemo(() => {
    if (harmLevel === undefined) return "";
    return language === "en-US" ? `Harm level ${harmLevel}` : `危害等级 ${harmLevel}级`;
  }, [harmLevel, language]);

  const showDiscovery = !keyword && harmLevel === undefined;

  const clearHarmLevel = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("harmLevel");
    setSearchParams(next, { replace: true });
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="px-5 pt-1 flex items-center gap-3">
          <div className="flex-1 h-[44px] bg-card glass rounded-md px-4 flex items-center gap-2 focus-within:focus-glow transition-shadow">
            <input
              autoFocus
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={t("搜索昆虫物种", "Search insect species")}
              className="flex-1 bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => updateQuery("")}><X size={16} className="text-muted-foreground" /></button>
            )}
          </div>
          <button onClick={() => navigate(-1)} className="text-body text-primary btn-tap">{t("取消", "Cancel")}</button>
        </div>

        {showDiscovery ? (
          <div className="px-5 mt-6">
            <h3 className="text-subtitle text-foreground mb-3">{t("热门搜索", "Trending searches")}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {hotTags.map(tag => (
                <button key={tag} onClick={() => updateQuery(tag)} className="px-4 py-2 border border-primary/30 text-primary rounded-full text-caption btn-tap">
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-subtitle text-foreground">{t("搜索历史", "Search history")}</h3>
              <button className="text-small text-muted-foreground">{t("清除", "Clear")}</button>
            </div>
            {historyItems.map(item => (
              <button key={item} onClick={() => updateQuery(item)} className="w-full flex items-center gap-3 py-3 border-b border-border tap-scale">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-body text-foreground">{item}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-5 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-muted-foreground">{t("搜索结果", "Search results")}</p>
              <button
                onClick={() => navigate({ pathname: "/search-filter", search: searchParams.toString() ? `?${searchParams.toString()}` : "" })}
                className="text-caption text-primary flex items-center gap-1"
              >
                <SlidersHorizontal size={14} /> {t("筛选", "Filter")}
              </button>
            </div>

            {activeFilterLabel && (
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-small">{activeFilterLabel}</span>
                <button onClick={clearHarmLevel} className="text-small text-muted-foreground">{t("清除筛选", "Clear filter")}</button>
              </div>
            )}

            {loading && <p className="text-small text-muted-foreground py-6">{t("正在搜索...", "Searching...")}</p>}
            {!loading && error && <p className="text-small text-destructive py-6">{error}</p>}
            {!loading && !error && results.length === 0 && (
              <p className="text-small text-muted-foreground py-6">{t("暂无匹配结果", "No matching species found")}</p>
            )}

            {!loading && !error && results.map(item => (
              <button
                key={item.id}
                onClick={() => navigate("/species-wiki", { state: { speciesId: item.id } })}
                className="w-full bg-card rounded-xl p-3 card-shadow micro-border flex items-center gap-3 mb-2 tap-scale"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary">
                  <SearchIcon size={20} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-body text-foreground font-semibold truncate">
                    {language === "en-US" ? item.speciesNameEn : item.speciesNameCn}
                  </p>
                  <p className="text-small text-muted-foreground truncate">{renderMeta(item)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;
