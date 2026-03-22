import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/components/ui/sonner";
import insectMantis from "@/assets/insect-mantis.jpg";
import { getAccessToken } from "@/lib/auth";
import { useI18n } from "@/lib/language";
import { resolveSpeciesCover } from "@/lib/species-cover";
import {
  followUser,
  getPublicUserProfile,
  listUserFavorites,
  listUserPosts,
  unfollowUser,
} from "@/services/user-service";
import type { InsectInfo, PostItem, PublicUserProfile } from "@/types/api";

type UserProfileTab = "posts" | "favorites";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { language, t } = useI18n();
  const [activeTab, setActiveTab] = useState<UserProfileTab>("posts");
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [favorites, setFavorites] = useState<InsectInfo[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [error, setError] = useState("");
  const [followPending, setFollowPending] = useState(false);

  const parsedUserId = Number(userId);
  const hasValidUserId = Number.isInteger(parsedUserId) && parsedUserId > 0;

  useEffect(() => {
    if (!hasValidUserId) {
      setError(t("用户不存在", "User not found"));
      setLoadingProfile(false);
      setLoadingPosts(false);
      return;
    }

    let cancelled = false;
    setLoadingProfile(true);
    setLoadingPosts(true);
    setError("");
    setActiveTab("posts");
    setFavorites([]);
    setFavoritesLoaded(false);

    Promise.all([
      getPublicUserProfile(parsedUserId),
      listUserPosts(parsedUserId, { page: 1, pageSize: 20 }),
    ])
      .then(([profileResponse, postPage]) => {
        if (cancelled) return;
        setProfile(profileResponse);
        setPosts(postPage.list);
      })
      .catch(fetchError => {
        if (cancelled) return;
        setProfile(null);
        setPosts([]);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : t("用户主页加载失败，请稍后重试", "Failed to load this profile. Please try again later."),
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingProfile(false);
          setLoadingPosts(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasValidUserId, parsedUserId, t]);

  useEffect(() => {
    if (!hasValidUserId || activeTab !== "favorites" || favoritesLoaded) {
      return;
    }

    let cancelled = false;
    setLoadingFavorites(true);

    listUserFavorites(parsedUserId, { page: 1, pageSize: 20 })
      .then(data => {
        if (cancelled) return;
        setFavorites(data.list);
        setFavoritesLoaded(true);
      })
      .catch(fetchError => {
        if (cancelled) return;
        toast.error(
          fetchError instanceof Error
            ? fetchError.message
            : t("收藏加载失败，请稍后重试", "Failed to load favorites. Please try again later."),
        );
        setFavorites([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingFavorites(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, favoritesLoaded, hasValidUserId, parsedUserId, t]);

  const stats = useMemo(
    () => [
      { value: profile?.recognitionCount ?? 0, label: t("识别", "Scans") },
      { value: profile?.postCount ?? 0, label: t("发布", "Posts") },
      { value: profile?.receivedLikeCount ?? 0, label: t("获赞", "Likes") },
    ],
    [profile, t],
  );

  const handleToggleFollow = async () => {
    if (!profile || profile.isSelf || followPending) return;

    if (!getAccessToken()) {
      navigate("/auth");
      return;
    }

    const previousFollowing = profile.isFollowing;
    setFollowPending(true);
    try {
      const response = previousFollowing ? await unfollowUser(profile.id) : await followUser(profile.id);
      setProfile(current =>
        current
          ? {
              ...current,
              isFollowing: response.isFollowing,
              followerCount: Math.max(
                0,
                current.followerCount + (response.isFollowing === previousFollowing ? 0 : response.isFollowing ? 1 : -1),
              ),
            }
          : current,
      );
    } catch (followError) {
      toast.error(
        followError instanceof Error
          ? followError.message
          : t("关注操作失败，请稍后重试", "Failed to update follow status. Please try again later."),
      );
    } finally {
      setFollowPending(false);
    }
  };

  const renderPosts = () => {
    if (loadingPosts) {
      return <div className="px-5 py-10 text-center text-caption text-muted-foreground">{t("动态加载中...", "Loading posts...")}</div>;
    }

    if (posts.length === 0) {
      return <div className="px-5 py-10 text-center text-caption text-muted-foreground">{t("Ta 还没有发布动态", "This user has not posted yet")}</div>;
    }

    return (
      <div className="space-y-3 px-5 py-4">
        {posts.map((post, index) => (
          <motion.button
            type="button"
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate("/post-detail", { state: { postId: post.id } })}
            className="w-full rounded-2xl bg-card p-4 text-left card-shadow micro-border"
          >
            <p className="text-caption leading-relaxed text-foreground">{post.content}</p>
            {post.topicTags ? <p className="mt-2 text-small text-primary">{post.topicTags}</p> : null}
            {post.locationName ? <p className="mt-1 text-small text-muted-foreground">{post.locationName}</p> : null}
            <div className="mt-3 flex gap-4 text-small text-muted-foreground">
              <span>{post.likeCount} {t("赞", "likes")}</span>
              <span>{post.commentCount} {t("评论", "comments")}</span>
            </div>
          </motion.button>
        ))}
      </div>
    );
  };

  const renderFavorites = () => {
    if (loadingFavorites && !favoritesLoaded) {
      return <div className="px-5 py-10 text-center text-caption text-muted-foreground">{t("收藏加载中...", "Loading favorites...")}</div>;
    }

    if (favorites.length === 0) {
      return <div className="px-5 py-10 text-center text-caption text-muted-foreground">{t("Ta 还没有公开收藏", "This user has no public favorites yet")}</div>;
    }

    return (
      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        {favorites.map((item, index) => {
          const name = language === "en-US" ? item.speciesNameEn : item.speciesNameCn;
          const subtitle = language === "en-US"
            ? `Recognized ${item.recognitionCount} times`
            : `已识别 ${item.recognitionCount} 次`;
          return (
            <motion.button
              type="button"
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate("/species-wiki", { state: { speciesId: item.id } })}
              className="overflow-hidden rounded-xl bg-card text-left card-shadow micro-border"
            >
              <img
                src={resolveSpeciesCover({
                  coverImageUrl: item.coverImageUrl,
                  fallbackSrc: insectMantis,
                })}
                alt={name}
                className="h-32 w-full object-cover"
              />
              <div className="p-3">
                <p className="text-caption font-semibold text-foreground line-clamp-1">{name}</p>
                <p className="text-small text-muted-foreground">{subtitle}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto hide-scrollbar bg-background pb-safe-sheet">
        <PageHeader title={t("用户主页", "Profile")} />

        {loadingProfile ? (
          <div className="px-5 py-10 text-center text-caption text-muted-foreground">{t("用户资料加载中...", "Loading profile...")}</div>
        ) : error || !profile ? (
          <div className="px-5 py-10 text-center text-caption text-muted-foreground">{error || t("用户不存在", "User not found")}</div>
        ) : (
          <>
            <div className="px-5 text-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.nickname} className="mx-auto h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-[40px]">🧑‍🔬</div>
              )}
              <h2 className="mt-3 text-[20px] font-bold text-foreground">{profile.nickname}</h2>
              {profile.bio ? <p className="mt-2 text-caption text-muted-foreground">{profile.bio}</p> : null}
              <p className="mt-2 text-small text-muted-foreground">
                {t("关注", "Following")} {profile.followingCount} · {t("粉丝", "Followers")} {profile.followerCount}
              </p>
              {!profile.isSelf ? (
                <button
                  onClick={() => void handleToggleFollow()}
                  disabled={followPending}
                  className="mt-3 h-9 rounded-full bg-primary px-6 text-caption font-semibold text-primary-foreground btn-tap disabled:opacity-60"
                >
                  {profile.isFollowing ? t("已关注", "Following") : t("关注", "Follow")}
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex gap-3 px-5">
              {stats.map(stat => (
                <div key={stat.label} className="flex-1 rounded-xl bg-card p-3 text-center card-shadow micro-border">
                  <p className="text-subtitle font-bold text-foreground">{stat.value}</p>
                  <p className="text-small text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-4 border-b border-border px-5">
              {[
                { key: "posts" as const, label: t("动态", "Posts") },
                { key: "favorites" as const, label: t("收藏", "Favorites") },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-body ${tab.key === activeTab ? "border-b-2 border-primary font-bold text-foreground" : "text-muted-foreground"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "posts" ? renderPosts() : renderFavorites()}
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default UserProfilePage;
