import { useState } from "react";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import LikeButton from "@/components/LikeButton";
import ShareSheet from "@/components/ShareSheet";
import insectButterfly from "@/assets/insect-butterfly.jpg";

const comments = [
  { avatar: "👨‍🏫", name: "生物老师", time: "1小时前", text: "太漂亮了！蓝闪蝶是世界上最美的蝴蝶之一", likes: 12 },
  { avatar: "🌿", name: "自然控", time: "30分钟前", text: "好羡慕！是在哪个公园拍到的？", likes: 5 },
  { avatar: "📸", name: "微距摄影师", time: "10分钟前", text: "拍得好清晰，用的什么镜头？", likes: 3 },
];

const PostDetailPage = () => {
  const [shareOpen, setShareOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  const handleSend = () => {
    if (!commentText.trim()) return;
    setLocalComments(prev => [...prev, {
      avatar: "🦋",
      name: "我",
      time: "刚刚",
      text: commentText,
      likes: 0,
    }]);
    setCommentText("");
  };

  return (
    <MobileLayout>
      <div className="h-full bg-background pb-20 overflow-y-auto hide-scrollbar relative">
        <PageHeader title="动态详情" />

        {/* Author */}
        <div className="flex items-center justify-between px-5 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-[20px]">🧑‍🔬</div>
            <div>
              <p className="text-caption text-foreground font-semibold">昆虫猎人</p>
              <p className="text-small text-muted-foreground">2 小时前</p>
            </div>
          </div>
          <button className="h-8 px-4 bg-primary text-primary-foreground rounded-full text-small font-semibold btn-tap">关注</button>
        </div>

        {/* Content */}
        <p className="px-5 mt-3 text-body text-foreground leading-relaxed">
          今天在公园发现了一只漂亮的蓝闪蝶！翅膀在阳光下闪着金属蓝色光泽，太美了 🦋
        </p>
        <img src={insectButterfly} alt="" className="w-full h-64 object-cover mt-3" />

        {/* Stats */}
        <div className="flex items-center gap-6 px-5 py-3 border-b border-border">
          <span className="text-small text-muted-foreground">128 赞</span>
          <span className="text-small text-muted-foreground">23 评论</span>
          <span className="text-small text-muted-foreground">8 分享</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around px-5 py-1 border-b border-border">
          <LikeButton initialCount={128} />
          <button className="flex items-center gap-1.5 text-muted-foreground btn-tap py-2">
            <MessageCircle size={20} />
            <span className="text-caption">评论</span>
          </button>
          <button onClick={() => setShareOpen(true)} className="flex items-center gap-1.5 text-muted-foreground btn-tap py-2">
            <Share2 size={20} />
            <span className="text-caption">分享</span>
          </button>
        </div>

        {/* Comments */}
        <div className="px-5 mt-3 space-y-4">
          {localComments.map((c, i) => (
            <motion.div
              key={i}
              initial={i >= comments.length ? { opacity: 0, x: 20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-[16px] flex-shrink-0">{c.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-small text-foreground font-semibold">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-caption text-foreground mt-0.5">{c.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <LikeButton initialCount={c.likes} size={12} showCount />
                  <button className="text-[11px] text-muted-foreground">回复</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 glass px-5 py-3 pb-8 flex items-center gap-3">
          <input
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="写评论..."
            className="flex-1 h-[40px] bg-secondary rounded-full px-4 text-caption text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!commentText.trim()}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center btn-tap disabled:opacity-40"
          >
            <Send size={16} className="text-primary-foreground" />
          </button>
        </div>

        <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
      </div>
    </MobileLayout>
  );
};

export default PostDetailPage;
