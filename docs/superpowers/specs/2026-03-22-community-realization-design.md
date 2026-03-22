# Community Realization Design

**Date:** 2026-03-22

## Goal

在不重做现有 UI 结构的前提下，把社区主链路从静态演示页升级为真实可用的前后端联调版本，覆盖：社区列表、发帖、帖子详情、评论、点赞。

## Scope

### Included
- `CommunityPage` 真实拉取帖子列表
- `PublishPage` 真实发布动态（正文 + 可选单图 + 基础元数据）
- `PostDetailPage` 真实拉取帖子详情与评论列表
- 真实发表评论
- 真实帖子点赞/取消点赞
- 社区相关前端类型与 service 层
- 对应页面的加载态、空态、错误态

### Excluded
- `UserProfilePage` 真实化
- 关注关系与“关注”tab 完整打通
- 分享统计真实化
- 评论回复树 / 评论点赞
- 社区图片多图上传

## Existing Constraints

### Frontend
- 社区相关页面已存在，但全部使用静态假数据：
  - `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx`
  - `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PublishPage.tsx`
  - `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx`
- 当前没有社区专用 service 与类型定义。

### Backend
- 已有帖子接口：
  - `GET /posts`
  - `POST /posts`
  - `GET /posts/{id}`
  - `POST /posts/{id}/like`
  - `GET /posts/{id}/comments`
  - `POST /posts/{id}/comments`
- 后端控制器：
  - `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/controller/PostController.java`
- 发帖 DTO 支持字段：
  - `content`
  - `topicTags`
  - `locationName`
  - `latitude`
  - `longitude`
  - `visibility`
- 当前后端返回的是 `Post` / `PostComment` 实体，**不包含作者昵称与头像扩展字段**。

## Recommended Approach

采用“最小改动接真接口”的方式：保留现有页面布局和交互骨架，仅将静态数据替换为真实请求，并在前端增加必要的数据转换层。

### Why this approach
- 改动小，能快速验证社区主链路是否可用
- 不引入额外状态库或大规模重构
- 避免同时推进 `UserProfilePage` / 关注关系 / 评论树，降低耦合

## Data Model Strategy

### Frontend types to add
新增帖子与评论相关类型，建议包括：
- `PostItem`
- `PostCommentItem`
- `PostListParams`
- `CreatePostRequest`
- `CreateCommentRequest`
- `ToggleLikeResponse`

### Author fallback strategy
由于当前后端没有返回作者扩展资料，这轮采用降级展示：
- 帖子作者名：优先使用当前登录用户的昵称（发帖成功后的本地插入场景），否则回退为 `用户 #<userId>` / `User #<userId>`
- 头像：统一使用现有圆形占位头像视觉
- 评论作者：同样按 `用户 #<userId>` 回退

这属于接口约束下的显式降级，不伪造后端不存在的字段。

## UI Behavior

### CommunityPage
- tab 映射：
  - 推荐 -> `recommend`
  - 关注 -> `following`
  - 最新 -> `latest`
- 切 tab 重新请求列表
- 列表展示真实 `content / imageUrl / likeCount / commentCount / createdAt`
- 空态：
  - 推荐/最新无内容 -> 显示暂无动态
  - 关注无内容 -> 显示“你关注的用户还没有发布内容”

### PublishPage
- “发布”按钮改为真实提交
- 支持选择单张图片
- `topicTags`、`locationName`、`visibility` 先用当前 UI 中已有值作为最小可提交字段
- 发布成功后返回社区页，并触发列表刷新

### PostDetailPage
- 根据 `postId` 拉取真实详情
- 拉取真实评论列表
- 评论成功后本地插入最新评论，避免整页重刷
- 点赞状态与数量同步更新

## Service Layer

新增：
- `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/services/post-service.ts`

职责：
- `listPosts(tab, page, pageSize)`
- `getPostDetail(postId)`
- `createPost(formData or payload)`
- `togglePostLike(postId)`
- `listPostComments(postId, page, pageSize)`
- `createPostComment(postId, payload)`

## Navigation / State

- `CommunityPage -> PostDetailPage` 通过 `state` 或 query 传 `postId`
- `PublishPage` 发布成功后返回 `/community`
- 可使用轻量 session 标记（如 `communityNeedsRefresh`）触发返回页刷新，但不引入全局 store

## Error Handling

- 列表加载失败：页面内错误提示 + toast
- 发帖失败：toast，保留输入内容
- 评论失败：toast，保留输入内容
- 点赞失败：toast，回滚本地 optimistic state
- 未登录：沿用现有认证失败处理，必要时跳转 `/auth`

## Testing Strategy

### Frontend tests
- `CommunityPage`：列表请求成功/失败、tab 切换
- `PublishPage`：提交 payload 正确、成功后跳转
- `PostDetailPage`：详情加载、评论列表加载、发表评论、点赞切换
- `post-service`：必要时补最小请求封装测试

### Verification
- `npm test`
- `npm run build`
- 社区主链路手工联调：
  1. 打开社区列表
  2. 发一条新帖子
  3. 在列表看到新帖子
  4. 打开详情
  5. 发表评论
  6. 点赞/取消点赞

## Risks

- 后端帖子/评论缺少作者扩展资料，前端展示只能先降级
- `following` tab 依赖关注关系，如果后端当前无关注数据，页面会长期为空态
- 发帖的图片上传是 `multipart/form-data`，前端需要严格按后端 `@RequestPart("data") + @RequestPart("image")` 的格式提交

## Success Criteria

- 社区页不再使用静态帖子数组
- 发帖、详情、评论、点赞全部走真实后端
- 页面结构不做重设计
- 真机/Web 均可跑通主链路
