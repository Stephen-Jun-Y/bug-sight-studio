import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import insectMantis from "@/assets/insect-mantis.jpg";
import insectBee from "@/assets/insect-bee.jpg";

const tabs = ["推荐", "关注", "最新"];
const posts = [
  {
    avatar: "🧑‍🔬",
    name: "昆虫猎人",
    time: "2 小时前",
    content: "今天在公园发现了一只漂亮的蓝闪蝶！翅膀在阳光下闪着金属蓝色光泽，太美了 🦋",
    img: insectButterfly,
    likes: 128,
    comments: 23,
    shares: 8,
  },
  {
    avatar: "👩‍🌾",
    name: "花园守护者",
    time: "5 小时前",
    content: "螳螂宝宝们孵化了！一个卵鞘里出来了好几百只小螳螂，自然太神奇了",
    img: insectMantis,
    likes: 256,
    comments: 45,
    shares: 19,
  },
  {
    avatar: "🐝",
    name: "养蜂人小李",
    time: "昨天",
    content: "记录一下今天的蜂箱检查，蜂群状态良好，蜜脾已经快满了",
    img: insectBee,
    likes: 89,
    comments: 12,
    shares: 3,
  },
];

const CommunityPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <MobileLayout>
      <div className="pt-14 pb-24 bg-background relative">
        {/* Header */}
        <div className="px-5 pt-4">
          <h1 className="text-display text-foreground mb-3">社区</h1>
          <div className="flex gap-4 border-b border-border">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setActiveTab(i)}
                className={`pb-2 text-body relative btn-tap ${i === activeTab ? "text-foreground font-bold" : "text-muted-foreground"}`}
              >
                {t}
                {i === activeTab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="px-5 mt-4 space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl card-shadow micro-border overflow-hidden"
            >
              <button onClick={() => navigate("/post-detail")} className="w-full text-left">
                {/* Author */}
                <div className="flex items-center gap-3 p-4 pb-2">
                  <button onClick={e => { e.stopPropagation(); navigate("/user-profile"); }} className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-[20px]">
                    {post.avatar}
                  </button>
                  <div>
                    <p className="text-caption text-foreground font-semibold">{post.name}</p>
                    <p className="text-small text-muted-foreground">{post.time}</p>
                  </div>
                </div>
                {/* Content */}
                <p className="px-4 text-caption text-foreground leading-relaxed">{post.content}</p>
                <img src={post.img} alt="" className="w-full h-48 object-cover mt-3" />
              </button>
              {/* Actions */}
              <div className="flex items-center justify-around px-4 py-3">
                {[
                  { icon: Heart, count: post.likes },
                  { icon: MessageCircle, count: post.comments },
                  { icon: Share2, count: post.shares },
                ].map(({ icon: Icon, count }, ai) => (
                  <button key={ai} className="flex items-center gap-1.5 text-muted-foreground btn-tap min-w-[44px] min-h-[44px] justify-center">
                    <Icon size={18} />
                    <span className="text-small">{count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAB */}
        <button
          onClick={() => navigate("/publish")}
          className="absolute bottom-24 right-5 w-14 h-14 bg-primary rounded-full card-shadow-hover flex items-center justify-center btn-tap z-30"
        >
          <Plus size={24} className="text-primary-foreground" />
        </button>
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default CommunityPage;
