import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Clock } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";

const hotTags = ["蝴蝶", "甲虫", "蜻蜓", "螳螂", "蜜蜂", "蚂蚁", "蝉", "萤火虫"];
const historyItems = ["帝王蝶", "中华螳螂", "七星瓢虫"];

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <MobileLayout>
      <div className="h-full bg-background pt-14">
        {/* Search bar */}
        <div className="px-5 pt-4 flex items-center gap-3">
          <div className="flex-1 h-[44px] bg-card glass rounded-md px-4 flex items-center gap-2 focus-within:focus-glow transition-shadow">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索昆虫物种"
              className="flex-1 bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}><X size={16} className="text-muted-foreground" /></button>
            )}
          </div>
          <button onClick={() => navigate(-1)} className="text-body text-primary btn-tap">取消</button>
        </div>

        {!query ? (
          <div className="px-5 mt-6">
            {/* Hot */}
            <h3 className="text-subtitle text-foreground mb-3">热门搜索</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {hotTags.map(tag => (
                <button key={tag} onClick={() => setQuery(tag)} className="px-4 py-2 border border-primary/30 text-primary rounded-full text-caption btn-tap">
                  {tag}
                </button>
              ))}
            </div>

            {/* History */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-subtitle text-foreground">搜索历史</h3>
              <button className="text-small text-muted-foreground">清除</button>
            </div>
            {historyItems.map(item => (
              <button key={item} onClick={() => setQuery(item)} className="w-full flex items-center gap-3 py-3 border-b border-border tap-scale">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-body text-foreground">{item}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-5 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-muted-foreground">搜索结果</p>
              <button onClick={() => navigate("/search-filter")} className="text-caption text-primary">筛选</button>
            </div>
            {["中华螳螂", "帝王蝶", "七星瓢虫"].filter(n => n.includes(query) || true).map(name => (
              <button key={name} onClick={() => navigate("/result")} className="w-full bg-card rounded-xl p-3 card-shadow micro-border flex items-center gap-3 mb-2 tap-scale">
                <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-[24px]">🐛</div>
                <div className="text-left">
                  <p className="text-body text-foreground font-semibold">{name}</p>
                  <p className="text-small text-muted-foreground">螳螂目 · 分布广泛</p>
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
