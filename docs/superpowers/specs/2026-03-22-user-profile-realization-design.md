# User Profile Realization Design

**Date:** 2026-03-22

## Goal

把 `UserProfilePage` 从静态展示页升级为真实可用的公开用户主页，覆盖：用户资料、关注/取关、用户动态列表、公开收藏列表，以及从社区列表/动态详情跳转进入用户主页。

## Scope

### Included
- `UserProfilePage` 真实拉取用户资料
- 真实关注状态与关注/取关
- 真实 `动态` tab
- 真实 `收藏` tab（公开可见）
- 社区列表和动态详情页的作者跳转
- 用户主页相关前后端类型、service、接口与测试

### Excluded
- 粉丝列表页
- 关注列表页
- 用户主页上的编辑资料入口
- 用户主页内的发帖/收藏编辑能力

## Existing Constraints

### Frontend
- `UserProfilePage` 当前是纯静态页：
  - `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/UserProfilePage.tsx`
- 路由当前是 `/user-profile`，刷新时没有稳定的 `userId`
- 社区列表和动态详情页已有作者展示，但没有主页跳转

### Backend
- 已有 `user_follows` 表与 `UserFollowMapper`，但没有公开的关注接口
- 已有帖子与收藏数据源：
  - `posts`
  - `favorites`
  - `recognition_history`
- 当前 `UserController` 仅覆盖 `/users/me` 相关能力

## Recommended Approach

采用“专用主页接口 + 最小前端改造”：

- 路由改为 `/user-profile/:userId`
- 后端新增公开用户主页接口，统一聚合资料与统计
- 前端 `UserProfilePage` 直接消费专用接口，不在页面层拼统计

### Why this approach
- 刷新页面不会丢 `userId`
- 用户主页和“我的资料页”职责清晰，不把 `/users/me` 弄成混合接口
- 关注关系、帖子、收藏都能独立扩展，后续做粉丝列表也不需要推翻

## Public API Design

新增接口：

- `GET /users/{id}/profile`
  - 返回：
    - `id`
    - `nickname`
    - `bio`
    - `avatarUrl`
    - `location`
    - `isFollowing`
    - `isSelf`
    - `recognitionCount`
    - `postCount`
    - `receivedLikeCount`
    - `favoriteCount`
    - `followerCount`
    - `followingCount`

- `GET /users/{id}/posts`
  - 返回该用户帖子分页
  - 继续沿用帖子分页结构
  - 帖子项继续带 `likedByCurrentUser`

- `GET /users/{id}/favorites`
  - 返回该用户收藏昆虫分页
  - 继续沿用收藏列表结构

- `GET /users/{id}/follow-status`
  - 返回 `{ isFollowing: boolean }`
  - 未登录时返回 `false`

- `POST /users/{id}/follow`
  - 关注指定用户

- `DELETE /users/{id}/follow`
  - 取消关注指定用户

## Public Visibility Rules

- 公开用户主页允许未登录访问
- 别人的 `动态` 允许公开查看
- 别人的 `收藏` 允许公开查看
- 未登录用户点击关注时，前端跳转登录页
- 自己查看自己时，前端隐藏关注按钮

## Frontend Behavior

### Route
- 将 `/user-profile` 改为 `/user-profile/:userId`

### UserProfilePage
- 顶部显示真实昵称、头像、简介
- 保留现有页面布局骨架
- 统计卡使用：
  - `recognitionCount`
  - `postCount`
  - `receivedLikeCount`
- 在资料区补充 `followerCount / followingCount`
- `动态` tab：
  - 展示用户发帖
  - 点击帖子进入 `/post-detail`
- `收藏` tab：
  - 复用现有收藏卡片视觉
  - 点击进入 `/species-wiki`
- 关注按钮：
  - 未登录 -> 跳 `/auth`
  - 已登录 -> 真实 follow/unfollow
  - 自己主页 -> 不显示

### CommunityPage / PostDetailPage
- 作者区域变为可点击跳转
- 目标路由：`/user-profile/:userId`

## Backend Aggregation Strategy

统计统一由后端计算：

- `recognitionCount`：`recognition_history` 中当前用户记录数
- `postCount`：该用户帖子数
- `receivedLikeCount`：该用户帖子累计点赞数
- `favoriteCount`：该用户收藏昆虫数
- `followerCount`：关注该用户的人数
- `followingCount`：该用户关注的人数

`location` 暂时保持空字符串，因为当前用户表未持久化该字段。

## Error Handling

- 用户不存在：返回明确错误，前端显示空态
- 自己关注自己：后端拒绝，前端正常 toast
- 未登录访问 follow/unfollow：沿用现有未登录错误
- 用户无帖子/无收藏：对应 tab 显示空态

## Testing Strategy

### Frontend
- `UserProfilePage`：
  - 按 `userId` 拉 profile
  - `动态 / 收藏` tab 切换
  - 已登录 follow/unfollow
  - 未登录 follow 跳登录
- `CommunityPage`：
  - 点击作者跳用户主页
- `PostDetailPage`：
  - 点击作者跳用户主页

### Backend
- 用户主页资料聚合
- follow/unfollow 行为
- 未登录 follow-status 为 `false`
- 自己主页 `isSelf=true`

## Success Criteria

- `/user-profile/:userId` 可直接刷新访问
- 用户主页资料、动态、收藏都是真数据
- 关注/取关真实可用
- 社区与动态详情都能跳用户主页
