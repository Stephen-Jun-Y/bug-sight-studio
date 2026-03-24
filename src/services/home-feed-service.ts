import { getAccessToken } from "@/lib/auth";
import { listRecognitionHistory } from "@/services/recognition-service";
import { getPopularInsects } from "@/services/species-service";
import type { HomeFeedData, InsectInfo, RecognitionResult } from "@/types/api";

const formatRelativeTime = (capturedAt: string) => {
  const target = new Date(capturedAt);
  if (Number.isNaN(target.getTime())) {
    return {
      cn: "刚刚",
      en: "Just now",
    };
  }

  const diffMs = Date.now() - target.getTime();
  const diffMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return {
      cn: `${Math.max(diffMinutes, 1)} 分钟前`,
      en: `${Math.max(diffMinutes, 1)}m ago`,
    };
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return {
      cn: `${diffHours} 小时前`,
      en: `${diffHours}h ago`,
    };
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return {
      cn: `${diffDays} 天前`,
      en: `${diffDays}d ago`,
    };
  }

  const diffWeeks = Math.round(diffDays / 7);
  return {
    cn: `${diffWeeks} 周前`,
    en: `${diffWeeks}w ago`,
  };
};

const toRecentItem = (item: RecognitionResult) => {
  const relative = formatRelativeTime(item.capturedAt);
  return {
    id: String(item.recognitionId),
    imageUrl: item.imageUrl,
    speciesNameCn: item.species?.name ?? "未识别",
    speciesNameEn: item.species?.latinName ?? "Unknown",
    capturedLabelCn: relative.cn,
    capturedLabelEn: relative.en,
  };
};

const toPopularItem = (item: InsectInfo) => ({
  id: String(item.id),
  imageUrl: item.coverImageUrl ?? "",
  speciesNameCn: item.speciesNameCn,
  speciesNameEn: item.speciesNameEn,
  recognitionLabelCn: `${item.recognitionCount.toLocaleString("zh-CN")} 次识别`,
  recognitionLabelEn: `${item.recognitionCount.toLocaleString("en-US")} recognitions`,
});

export const getHomeFeed = async (): Promise<HomeFeedData> => {
  const [popularItems, recentItems] = await Promise.all([
    getPopularInsects(6).then((items) => items.map(toPopularItem)),
    getAccessToken()
      ? listRecognitionHistory({ page: 1, pageSize: 5 }).then((page) =>
          page.list.filter((item) => !item.isUnknown).map(toRecentItem),
        )
      : Promise.resolve([]),
  ]);

  return {
    recentItems,
    popularItems,
  };
};
