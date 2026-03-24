export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface AuthUser {
  id: number;
  nickname?: string;
  avatarUrl?: string;
}

export interface AuthPayload {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  userId?: number;
  nickname?: string;
  avatarUrl?: string;
  user?: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
  agreePolicy: boolean;
}

export interface UserProfile {
  id: number;
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
}

export interface CurrentUserProfile {
  id: number;
  nickname?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
}

export interface HomeRecentItem {
  id: string;
  imageUrl: string;
  speciesNameCn: string;
  speciesNameEn: string;
  capturedLabelCn: string;
  capturedLabelEn: string;
}

export interface HomePopularItem {
  id: string;
  imageUrl: string;
  speciesNameCn: string;
  speciesNameEn: string;
  recognitionLabelCn: string;
  recognitionLabelEn: string;
}

export interface HomeFeedData {
  recentItems: HomeRecentItem[];
  popularItems: HomePopularItem[];
}

export interface PublicUserProfile {
  id: number;
  nickname: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  isFollowing: boolean;
  isSelf: boolean;
  recognitionCount: number;
  postCount: number;
  receivedLikeCount: number;
  favoriteCount: number;
  followerCount: number;
  followingCount: number;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}

export interface UpdateCurrentUserProfileRequest {
  nickname?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export interface ChangeCurrentUserPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AchievementItem {
  id: number;
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  targetValue: number;
  currentValue: number;
  progressPercent: number;
  unlocked: boolean;
  unlockedAt?: string | null;
}

export interface AchievementProgress {
  unlockedCount: number;
  totalCount: number;
  items: AchievementItem[];
}

export interface RecognitionSpecies {
  id: number;
  name: string;
  latinName: string;
}

export interface SimilarSpeciesScore {
  speciesId: number;
  name: string;
  score: number;
}

export interface RecognitionResult {
  recognitionId: number;
  species: RecognitionSpecies | null;
  confidence: number;
  similar: SimilarSpeciesScore[];
  imageUrl: string;
  note?: string | null;
  location?: string | null;
  capturedAt: string;
  isUnknown?: boolean;
}

export interface LocalizedText {
  cn?: string | null;
  en?: string | null;
}

export interface InsectI18n {
  orderName: LocalizedText;
  familyName: LocalizedText;
  genusName: LocalizedText;
  bodyLength: LocalizedText;
  distribution: LocalizedText;
  activeSeason: LocalizedText;
  protectionLevel: LocalizedText;
  description: LocalizedText;
  morphology: LocalizedText;
  habits: LocalizedText;
}

export interface SpeciesSearchParams {
  q?: string;
  page?: number;
  pageSize?: number;
  harmLevel?: number;
}

export interface HotSearchItem {
  keyword: string;
  count: number;
}

export interface FavoriteStatusResponse {
  isFavorited: boolean;
}

export interface RecognitionUpdateRequest {
  note?: string | null;
  locationName?: string | null;
}

export interface PostItem {
  id: number;
  userId: number;
  authorNickname?: string | null;
  authorAvatarUrl?: string | null;
  content: string;
  imageUrl?: string | null;
  topicTags?: string | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  visibility: number;
  likedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCommentItem {
  id: number;
  postId: number;
  userId: number;
  authorNickname?: string | null;
  authorAvatarUrl?: string | null;
  parentId?: number | null;
  content: string;
  likeCount: number;
  createdAt: string;
}

export interface PostListParams {
  tab?: "recommend" | "following" | "latest";
  page?: number;
  pageSize?: number;
}

export interface CreatePostPayload {
  content: string;
  topicTags?: string | null;
  locationName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visibility?: number;
}

export interface CreatePostCommentPayload {
  content: string;
  parentId?: number | null;
}

export interface TogglePostLikeResponse {
  isLiked: boolean;
}

export interface InsectInfo {
  id: number;
  speciesNameCn: string;
  speciesNameEn: string;
  orderName: string;
  orderNameCn?: string | null;
  familyName: string;
  familyNameCn?: string | null;
  genusName?: string | null;
  genusNameCn?: string | null;
  bodyLength?: string | null;
  bodyLengthEn?: string | null;
  distribution?: string | null;
  distributionEn?: string | null;
  activeSeason?: string | null;
  activeSeasonEn?: string | null;
  protectionLevel?: string | null;
  protectionLevelEn?: string | null;
  harmLevel: number;
  description?: string | null;
  descriptionEn?: string | null;
  morphology?: string | null;
  morphologyEn?: string | null;
  habits?: string | null;
  habitsEn?: string | null;
  recognitionCount: number;
  coverImageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  i18n?: InsectI18n;
}
