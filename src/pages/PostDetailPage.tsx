import { useEffect, useState } from "react";
import { Heart, MapPin, MessageCircle, Send, Share2 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import ShareSheet from "@/components/ShareSheet";
import { toast } from "@/components/ui/sonner";
import insectButterfly from "@/assets/insect-butterfly.jpg";
import { getStoredUser } from "@/lib/auth";
import { useI18n } from "@/lib/language";
import { createPostComment, getPostDetail, listPostComments, togglePostLike } from "@/services/post-service";
import type { PostCommentItem, PostItem } from "@/types/api";
import { useLocation, useNavigate } from "react-router-dom";

type PostDetailLocationState = {
  postId?: number;
};

const formatFallbackAuthorName = (userId: number, language: "zh-CN" | "en-US") => {
  const currentUser = getStoredUser();
  if (currentUser?.id === userId && currentUser.nickname?.trim()) {
    return currentUser.nickname.trim();
  }

  return language === "en-US" ? `User #${userId}` : `用户 #${userId}`;
};

const getPostAuthorDisplayName = (
  item: Pick<PostItem, "userId" | "authorNickname">,
  language: "zh-CN" | "en-US",
) => {
  return item.authorNickname?.trim() || formatFallbackAuthorName(item.userId, language);
};

const getCommentAuthorDisplayName = (
  item: Pick<PostCommentItem, "userId" | "authorNickname">,
  language: "zh-CN" | "en-US",
) => {
  return item.authorNickname?.trim() || formatFallbackAuthorName(item.userId, language);
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

const PostDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [shareOpen, setShareOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState<PostItem | null>(null);
  const [comments, setComments] = useState<PostCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const postId = (location.state as PostDetailLocationState | null)?.postId;
  const postAuthorName = post ? getPostAuthorDisplayName(post, language) : "";

  useEffect(() => {
    if (postId == null) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      getPostDetail(postId),
      listPostComments(postId, { page: 1, pageSize: 20 }),
    ])
      .then(([postDetail, commentPage]) => {
        if (cancelled) return;
        setPost(postDetail);
        setLiked(Boolean(postDetail.likedByCurrentUser));
        setComments(commentPage.list);
      })
      .catch(error => {
        if (cancelled) return;
        toast.error(
          error instanceof Error
            ? error.message
            : t("动态详情加载失败，请稍后重试", "Failed to load post details. Please try again later."),
        );
        setPost(null);
        setComments([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [postId, t]);

  const handleToggleLike = async () => {
    if (!post || likePending) return;

    const previousLiked = liked;
    const nextLiked = !previousLiked;
    setLikePending(true);
    setLiked(nextLiked);
    setPost(current =>
      current
        ? {
            ...current,
            likeCount: Math.max(0, current.likeCount + (nextLiked ? 1 : -1)),
          }
        : current,
    );

    try {
      const response = await togglePostLike(post.id);
      if (response.isLiked !== nextLiked) {
        setLiked(response.isLiked);
        setPost(current =>
          current
            ? {
                ...current,
                likeCount: Math.max(0, current.likeCount + (response.isLiked ? 1 : -1) - (nextLiked ? 1 : -1)),
              }
            : current,
        );
      }
    } catch (error) {
      setLiked(previousLiked);
      setPost(current =>
        current
          ? {
              ...current,
              likeCount: Math.max(0, current.likeCount + (previousLiked ? 1 : -1) - (nextLiked ? 1 : -1)),
            }
          : current,
      );
      toast.error(error instanceof Error ? error.message : t("点赞失败，请稍后重试", "Failed to update like. Please try again later."));
    } finally {
      setLikePending(false);
    }
  };

  const handleSend = async () => {
    if (!post || commentSubmitting) return;

    const trimmedContent = commentText.trim();
    if (!trimmedContent) return;

    setCommentSubmitting(true);
    try {
      const createdComment = await createPostComment(post.id, {
        content: trimmedContent,
        parentId: null,
      });

      setComments(prev => [...prev, createdComment]);
      setPost(current => (current ? { ...current, commentCount: current.commentCount + 1 } : current));
      setCommentText("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("评论失败，请稍后重试", "Failed to post comment. Please try again later."),
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (postId == null) {
    return (
      <MobileLayout>
        <div className="flex h-full flex-col items-center justify-center bg-background px-5 text-center">
          <p className="text-subtitle text-foreground">{t("缺少动态信息", "Missing post information")}</p>
          <p className="mt-2 text-caption text-muted-foreground">{t("请从社区列表重新进入动态详情", "Please open the post again from the community feed.")}</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative h-full overflow-y-auto hide-scrollbar bg-background pb-safe-page">
        <PageHeader title={t("动态详情", "Post details")} />

        {loading ? (
          <div className="px-5 py-8 text-center text-caption text-muted-foreground">{t("动态加载中...", "Loading post details...")}</div>
        ) : !post ? (
          <div className="px-5 py-8 text-center text-caption text-muted-foreground">{t("动态不存在或已删除", "This post is unavailable.")}</div>
        ) : (
          <>
            <div className="mt-2 flex items-center justify-between px-5">
              <button
                type="button"
                onClick={() => navigate(`/user-profile/${post.userId}`)}
                aria-label={t(`查看 ${postAuthorName} 的主页`, `View ${postAuthorName}'s profile`)}
                className="flex items-center gap-3 text-left btn-tap"
              >
                {post.authorAvatarUrl ? (
                  <img
                    src={post.authorAvatarUrl}
                    alt={postAuthorName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-small font-semibold text-primary">
                    #{post.userId}
                  </div>
                )}
                <div>
                  <p className="text-caption font-semibold text-foreground">{postAuthorName}</p>
                  <p className="text-small text-muted-foreground">{formatPostTime(post.createdAt, language)}</p>
                </div>
              </button>
              {post.locationName ? (
                <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-small text-muted-foreground">
                  <MapPin size={14} />
                  <span>{post.locationName}</span>
                </div>
              ) : null}
            </div>

            <p className="mt-3 px-5 text-body leading-relaxed text-foreground">{post.content}</p>
            {post.topicTags ? <p className="mt-2 px-5 text-small text-primary">{post.topicTags}</p> : null}
            <img src={post.imageUrl || insectButterfly} alt="" className="mt-3 h-64 w-full object-cover" />

            <div className="flex items-center gap-6 border-b border-border px-5 py-3">
              <span className="text-small text-muted-foreground">
                {post.likeCount} {t("赞", "likes")}
              </span>
              <span className="text-small text-muted-foreground">
                {post.commentCount} {t("评论", "comments")}
              </span>
              <span className="text-small text-muted-foreground">
                {post.shareCount} {t("分享", "shares")}
              </span>
            </div>

            <div className="flex items-center justify-around border-b border-border px-5 py-1">
              <button
                onClick={() => void handleToggleLike()}
                disabled={likePending}
                aria-label={liked ? t("取消点赞", "Unlike") : t("点赞", "Like")}
                className="flex min-h-[44px] items-center gap-1.5 text-muted-foreground btn-tap disabled:opacity-50"
              >
                <Heart size={20} className={liked ? "fill-destructive text-destructive" : ""} />
                <span className="text-caption">{t("点赞", "Like")}</span>
              </button>
              <button className="flex min-h-[44px] items-center gap-1.5 text-muted-foreground btn-tap">
                <MessageCircle size={20} />
                <span className="text-caption">{t("评论", "Comment")}</span>
              </button>
              <button onClick={() => setShareOpen(true)} className="flex min-h-[44px] items-center gap-1.5 text-muted-foreground btn-tap">
                <Share2 size={20} />
                <span className="text-caption">{t("分享", "Share")}</span>
              </button>
            </div>

            <div className="mt-3 space-y-4 px-5 pb-24">
              {comments.length === 0 ? (
                <div className="py-6 text-center text-caption text-muted-foreground">{t("还没有评论，来抢沙发吧", "No comments yet. Be the first to comment.")}</div>
              ) : (
                comments.map(comment => {
                  const authorName = getCommentAuthorDisplayName(comment, language);
                  return (
                    <div key={comment.id} className="flex gap-3">
                      {comment.authorAvatarUrl ? (
                        <img
                          src={comment.authorAvatarUrl}
                          alt={authorName}
                          className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-muted-foreground">
                          #{comment.userId}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-small font-semibold text-foreground">{authorName}</span>
                          <span className="text-[11px] text-muted-foreground">{formatPostTime(comment.createdAt, language)}</span>
                        </div>
                        <p className="mt-0.5 text-caption text-foreground">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 glass px-5 py-3 pb-safe-sheet">
          <input
            value={commentText}
            onChange={event => setCommentText(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter") {
                void handleSend();
              }
            }}
            placeholder={t("写评论...", "Write a comment...")}
            className="h-[40px] flex-1 rounded-full bg-secondary px-4 text-caption text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!commentText.trim() || commentSubmitting || !post}
            aria-label={t("发送评论", "Send comment")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary btn-tap disabled:opacity-40"
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
