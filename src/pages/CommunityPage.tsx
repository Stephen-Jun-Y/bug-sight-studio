import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import TabBar from "@/components/TabBar";
import ShareSheet from "@/components/ShareSheet";
import { toast } from "@/components/ui/sonner";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import { getAccessToken, getStoredUser } from "@/lib/auth";
import { useI18n } from "@/lib/language";
import { listPosts, togglePostLike } from "@/services/post-service";
import type { PostItem } from "@/types/api";

type CommunityTab = "recommend" | "following" | "latest";

const formatFallbackAuthorName = (userId: number, language: "zh-CN" | "en-US") => {
  const currentUser = getStoredUser();
  if (currentUser?.id === userId && currentUser.nickname?.trim()) {
    return currentUser.nickname.trim();
  }

  return language === "en-US" ? `User #${userId}` : `用户 #${userId}`;
};

const getAuthorDisplayName = (post: Pick<PostItem, "userId" | "authorNickname">, language: "zh-CN" | "en-US") => {
  return post.authorNickname?.trim() || formatFallbackAuthorName(post.userId, language);
};

const formatPostTime = (value: string, language: "zh-CN" | "en-US") => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  if (diffMinutes < 60) {
    return language === "en-US" ? `${diffMinutes}m ago` : `${diffMinutes} 分钟前`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return language === "en-US" ? `${diffHours}h ago` : `${diffHours} 小时前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return language === "en-US" ? `${diffDays}d ago` : `${diffDays} 天前`;
  }

  return new Intl.DateTimeFormat(language === "en-US" ? "en-US" : "zh-CN", {
    month: "numeric",
    day: "numeric",
  }).format(parsed);
};

const CommunityPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<CommunityTab>("recommend");
  const [shareOpen, setShareOpen] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [likePendingIds, setLikePendingIds] = useState<number[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  const refreshAt = (location.state as { refreshAt?: number } | null)?.refreshAt;
  const isAuthenticated = Boolean(getAccessToken());
  const requiresFollowingLogin = activeTab === "following" && !isAuthenticated;

  const tabs = useMemo(
    () => [
      { label: t("推荐", "Recommended"), value: "recommend" as const },
      { label: t("关注", "Following"), value: "following" as const },
      { label: t("最新", "Latest"), value: "latest" as const },
    ],
    [t],
  );

  useEffect(() => {
    let cancelled = false;

    if (requiresFollowingLogin) {
      setPosts([]);
      setLikedMap({});
      setError(null);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);

    listPosts({ tab: activeTab, page: 1, pageSize: 20 })
      .then(data => {
        if (cancelled) return;
        setPosts(data.list);
        setLikedMap(
          Object.fromEntries(
            data.list.map(post => [post.id, Boolean(post.likedByCurrentUser)]),
          ),
        );
      })
      .catch(fetchError => {
        if (cancelled) return;
        setPosts([]);
        setLikedMap({});
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : t("社区内容加载失败，请稍后重试", "Failed to load community posts. Please try again later."),
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, refreshAt, reloadKey, requiresFollowingLogin, t]);

  const openPostDetail = (postId: number) => {
    navigate("/post-detail", { state: { postId } });
  };

  const handleToggleLike = async (event: React.MouseEvent, postId: number) => {
    event.stopPropagation();
    if (likePendingIds.includes(postId)) return;

    const previousLiked = likedMap[postId] ?? false;
    const nextLiked = !previousLiked;

    setLikePendingIds(prev => [...prev, postId]);
    setLikedMap(prev => ({ ...prev, [postId]: nextLiked }));
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1)),
            }
          : post,
      ),
    );

    try {
      const response = await togglePostLike(postId);
      if (response.isLiked !== nextLiked) {
        setLikedMap(prev => ({ ...prev, [postId]: response.isLiked }));
        setPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likeCount: Math.max(0, post.likeCount + (response.isLiked ? 1 : -1) - (nextLiked ? 1 : -1)),
                }
              : post,
          ),
        );
      }
    } catch (likeError) {
      setLikedMap(prev => ({ ...prev, [postId]: previousLiked }));
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likeCount: Math.max(0, post.likeCount + (previousLiked ? 1 : -1) - (nextLiked ? 1 : -1)),
              }
            : post,
        ),
      );
      toast.error(
        likeError instanceof Error
          ? likeError.message
          : t("点赞操作失败，请稍后重试", "Failed to update like. Please try again later."),
      );
    } finally {
      setLikePendingIds(prev => prev.filter(id => id !== postId));
    }
  };

  const emptyStateText =
    requiresFollowingLogin
      ? t("登录后查看你关注的动态", "Sign in to view posts from people you follow")
      : activeTab === "following"
      ? t("你关注的用户还没有发布内容", "People you follow have not posted yet")
      : t("还没有社区动态", "No community posts yet");

  return (
    <MobileLayout>
      <div className="relative h-full overflow-y-auto hide-scrollbar bg-background safe-top-offset pb-safe-page">
        <div className="px-5 pt-1">
          <h1 className="mb-3 text-display text-foreground">{t("社区", "Community")}</h1>
          <div className="flex gap-4 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative pb-2 text-body btn-tap ${
                  tab.value === activeTab ? "font-bold text-foreground" : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {tab.value === activeTab && (
                  <motion.div layoutId="community-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4 px-5">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center text-caption text-muted-foreground">
              {t("社区内容加载中...", "Loading community posts...")}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-caption text-muted-foreground">{error}</p>
              <button
                onClick={() => setReloadKey(current => current + 1)}
                className="mt-3 h-[40px] rounded-full bg-primary px-4 text-small font-semibold text-primary-foreground btn-tap"
              >
                {t("重新加载", "Retry")}
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-caption text-muted-foreground">{emptyStateText}</p>
              {requiresFollowingLogin ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="mt-3 h-[40px] rounded-full bg-primary px-4 text-small font-semibold text-primary-foreground btn-tap"
                >
                  {t("去登录", "Sign in")}
                </button>
              ) : null}
            </div>
          ) : (
            posts.map((post, index) => {
              const isLiked = likedMap[post.id] ?? false;
              const isLikePending = likePendingIds.includes(post.id);
              const authorName = getAuthorDisplayName(post, language);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => openPostDetail(post.id)}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPostDetail(post.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="overflow-hidden rounded-2xl bg-card micro-border card-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex items-center gap-3 p-4 pb-2">
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        navigate(`/user-profile/${post.userId}`);
                      }}
                      aria-label={t(`查看 ${authorName} 的主页`, `View ${authorName}'s profile`)}
                      className="flex items-center gap-3 text-left btn-tap"
                    >
                      {post.authorAvatarUrl ? (
                        <img
                          src={post.authorAvatarUrl}
                          alt={authorName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-small font-semibold text-primary">
                          #{post.userId}
                        </div>
                      )}
                      <div>
                        <p className="text-caption font-semibold text-foreground">{authorName}</p>
                        <p className="text-small text-muted-foreground">{formatPostTime(post.createdAt, language)}</p>
                      </div>
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <p className="text-caption leading-relaxed text-foreground">{post.content}</p>
                    {post.topicTags ? <p className="mt-2 text-small text-primary">{post.topicTags}</p> : null}
                    {post.locationName ? <p className="mt-1 text-small text-muted-foreground">{post.locationName}</p> : null}
                  </div>

                  <img src={post.imageUrl || insectButterfly} alt="" className="h-48 w-full object-cover" />

                  <div className="flex items-center justify-around px-4 py-1">
                    <button
                      onClick={event => void handleToggleLike(event, post.id)}
                      disabled={isLikePending}
                      aria-label={isLiked ? t("取消点赞", "Unlike") : t("点赞", "Like")}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 text-muted-foreground btn-tap disabled:opacity-50"
                    >
                      <Heart size={18} className={isLiked ? "fill-destructive text-destructive" : ""} />
                      <span className="text-small">{post.likeCount}</span>
                    </button>
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        openPostDetail(post.id);
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 text-muted-foreground btn-tap"
                    >
                      <MessageCircle size={18} />
                      <span className="text-small">{post.commentCount}</span>
                    </button>
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        setShareOpen(true);
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 text-muted-foreground btn-tap"
                    >
                      <Share2 size={18} />
                      <span className="text-small">{post.shareCount}</span>
                    </button>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <button
          onClick={() => navigate("/publish")}
          className="absolute right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary card-shadow-hover btn-tap bottom-safe-fab"
          aria-label={t("发布", "Create post")}
        >
          <Plus size={24} className="text-primary-foreground" />
        </button>

        <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
      </div>
      <TabBar />
    </MobileLayout>
  );
};

export default CommunityPage;
