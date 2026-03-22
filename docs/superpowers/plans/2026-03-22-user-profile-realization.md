# User Profile Realization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将公开用户主页、关注关系、用户动态与公开收藏从静态演示升级为真实前后端联调能力。

**Architecture:** 后端新增一组专用用户主页接口，聚合资料、统计、关注状态、帖子列表与收藏列表；前端将 `UserProfilePage` 改为基于 `:userId` 的真实路由，并从社区与帖子详情跳转进入。实现保持现有页面结构，不做重设计。

**Tech Stack:** Spring Boot, MyBatis-Plus, React, Vite, TypeScript, React Router, Vitest, JUnit 5

---

## File Structure

### Frontend
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/App.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/UserProfilePage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/services/user-service.ts`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/types/api.ts`
- Add/Modify tests under `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/`

### Backend
- Modify: `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/controller/UserController.java`
- Modify: `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/service/PostService.java`
- Modify: `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/service/FavoriteService.java`
- Add: `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/service/UserProfileService.java`
- Add DTOs under `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/main/java/com/bugsight/dto/response/`
- Add tests under `/Users/Zhuanz1/Documents/Playground/bugsight-backend/src/test/java/com/bugsight/service/`

---

## Chunk 1: Failing Tests First

- [ ] 前端新增 `user-profile-page` 测试，先覆盖：
  - 读取 `/user-profile/:userId`
  - profile 加载
  - `动态 / 收藏` tab 切换
  - follow/unfollow
  - 未登录 follow 跳 `/auth`
- [ ] 扩展社区与帖子详情测试，先让“点击作者跳转主页”失败
- [ ] 后端新增 `UserProfileServiceTest`，先覆盖：
  - 资料聚合统计
  - follow/unfollow
  - 匿名 follow-status
- [ ] 先分别运行失败测试，确认是“缺功能”而不是测试本身写错

## Chunk 2: Backend Public Profile + Follow APIs

- [ ] 新增公开用户主页 DTO，字段固定为：
  - `id / nickname / bio / avatarUrl / location / isFollowing / isSelf`
  - `recognitionCount / postCount / receivedLikeCount / favoriteCount / followerCount / followingCount`
- [ ] 在 `UserProfileService` 中实现：
  - `getPublicProfile`
  - `getFollowStatus`
  - `followUser`
  - `unfollowUser`
  - 自己不能关注自己
- [ ] 在 `PostService` 中补 `listUserPosts`
- [ ] 在 `FavoriteService` 中补 `listFavoritesByUser`
- [ ] 在 `UserController` 中新增：
  - `GET /users/{id}/profile`
  - `GET /users/{id}/posts`
  - `GET /users/{id}/favorites`
  - `GET /users/{id}/follow-status`
  - `POST /users/{id}/follow`
  - `DELETE /users/{id}/follow`
- [ ] 运行后端定向测试，确认通过

## Chunk 3: Frontend User Profile Page

- [ ] 扩展 `src/types/api.ts`，补用户主页返回类型
- [ ] 扩展 `src/services/user-service.ts`，补：
  - `getPublicUserProfile`
  - `listUserPosts`
  - `listUserFavorites`
  - `getUserFollowStatus`
  - `followUser`
  - `unfollowUser`
- [ ] 把 `App.tsx` 路由改成 `/user-profile/:userId`
- [ ] 将 `UserProfilePage` 改成真实页：
  - 读取 `userId`
  - 拉资料
  - 加载 `动态` tab
  - 切换到 `收藏` tab 时拉收藏
  - 自己主页隐藏关注按钮
  - 未登录点击关注跳 `/auth`
- [ ] 运行前端定向测试，确认通过

## Chunk 4: Author Navigation Wiring

- [ ] `CommunityPage` 作者区域改为可点击，跳 `/user-profile/:userId`
- [ ] `PostDetailPage` 作者区域改为可点击，跳 `/user-profile/:userId`
- [ ] 跑对应前端测试，确认跳转正确

## Chunk 5: Verification

- [ ] 前端定向测试：
  - `npm test -- --run src/test/user-profile-page.test.tsx src/test/community-page-real.test.tsx src/test/post-detail-page-real.test.tsx`
- [ ] 前端全量测试：
  - `npm test`
- [ ] 前端构建：
  - `npm run build`
- [ ] 后端定向测试：
  - `mvn -q -Dtest=UserProfileServiceTest test`
- [ ] 后端全量测试：
  - `mvn -q test`
- [ ] 真实烟测：
  - 社区列表点作者进入主页
  - 帖子详情点作者进入主页
  - 主页切换 `动态 / 收藏`
  - 关注/取关真实生效
