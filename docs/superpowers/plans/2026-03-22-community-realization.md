# Community Realization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将社区主链路从静态演示页面升级为真实可联调版本，覆盖帖子列表、发帖、详情、评论与点赞。

**Architecture:** 保留现有页面结构与交互骨架，新增一个轻量的 `post-service` 数据层，把社区页、发帖页和详情页的静态数组替换为真实接口请求。由于后端未返回作者扩展资料，前端增加最小映射层，对作者昵称与头像采用显式降级展示。

**Tech Stack:** React, Vite, TypeScript, React Router, existing API client, Vitest, Testing Library

---

## File Structure

### New files
- Create: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/services/post-service.ts`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/community-page-real.test.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/publish-page-real.test.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/post-detail-page-real.test.tsx`

### Modified files
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/types/api.ts`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PublishPage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx`

---

## Chunk 1: Community Types and Service

### Task 1: Define community API types

**Files:**
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/types/api.ts`

- [ ] **Step 1: Write the failing test**

Create a test that imports the new community-facing types from `src/types/api.ts` through the page tests added later.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/community-page-real.test.tsx`
Expected: FAIL because community types/service are missing.

- [ ] **Step 3: Add minimal types**

Add:
- `PostItem`
- `PostCommentItem`
- `PostListParams`
- `CreatePostPayload`
- `CreatePostCommentPayload`
- `TogglePostLikeResponse`

Use exact backend field names where possible:
- post: `id, userId, content, imageUrl, topicTags, locationName, latitude, longitude, likeCount, commentCount, shareCount, visibility, createdAt, updatedAt`
- comment: `id, postId, userId, parentId, content, likeCount, createdAt`

- [ ] **Step 4: Run tests to verify types compile**

Run: `npm test -- --run src/test/community-page-real.test.tsx`
Expected: still FAIL, but now because `post-service` / page behavior is not implemented.

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/types/api.ts
git commit -m "feat: add community api types"
```

### Task 2: Add post service

**Files:**
- Create: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/services/post-service.ts`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/lib/api-client.ts` (only if multipart helper is needed)

- [ ] **Step 1: Write the failing test**

Use page tests to require these exports:
- `listPosts`
- `getPostDetail`
- `createPost`
- `togglePostLike`
- `listPostComments`
- `createPostComment`

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/community-page-real.test.tsx src/test/publish-page-real.test.tsx src/test/post-detail-page-real.test.tsx`
Expected: FAIL because the service does not exist.

- [ ] **Step 3: Write minimal implementation**

Implement service functions using the existing API client conventions:
- `listPosts({ tab, page, pageSize }) -> GET /posts`
- `getPostDetail(id) -> GET /posts/{id}`
- `togglePostLike(id) -> POST /posts/{id}/like`
- `listPostComments(id, page, pageSize) -> GET /posts/{id}/comments`
- `createPostComment(id, payload) -> POST /posts/{id}/comments`
- `createPost(data, image?)` must submit `multipart/form-data` using:
  - part `data`: JSON blob/string
  - part `image`: file when present

- [ ] **Step 4: Run tests to verify service wiring compiles**

Run: `npm test -- --run src/test/community-page-real.test.tsx src/test/publish-page-real.test.tsx src/test/post-detail-page-real.test.tsx`
Expected: FAIL now at page behavior, not missing exports.

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/services/post-service.ts /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/lib/api-client.ts
git commit -m "feat: add community post service"
```

---

## Chunk 2: Community List Page

### Task 3: Replace static community feed with real post list

**Files:**
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/community-page-real.test.tsx`

- [ ] **Step 1: Write the failing test**

Cover:
- initial `recommend` tab triggers `listPosts`
- switching to `latest` triggers a new request
- list renders returned post content
- empty `following` tab shows empty state

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/community-page-real.test.tsx`
Expected: FAIL because page still renders hard-coded posts.

- [ ] **Step 3: Write minimal implementation**

Update page behavior:
- remove hard-coded `posts` array
- map tabs to backend values: `recommend`, `following`, `latest`
- fetch on mount and on tab change
- show loading/empty/error states
- render `用户 #<userId>` / `User #<userId>` as fallback author label
- navigate to `/post-detail` with `state: { postId }`
- keep share sheet and FAB layout unchanged

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test -- --run src/test/community-page-real.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/community-page-real.test.tsx
git commit -m "feat: load community feed from backend"
```

---

## Chunk 3: Publish Flow

### Task 4: Make publish page submit a real post

**Files:**
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PublishPage.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/publish-page-real.test.tsx`

- [ ] **Step 1: Write the failing test**

Cover:
- publish button disabled when content is empty
- clicking publish calls `createPost`
- success navigates back to `/community`
- failure keeps content intact and shows error feedback

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/publish-page-real.test.tsx`
Expected: FAIL because publish is currently UI-only.

- [ ] **Step 3: Write minimal implementation**

Update page to:
- manage selected image file in local state
- build `CreatePostPayload` with:
  - `content`
  - `topicTags`
  - `locationName`
  - `visibility`
- submit through `createPost`
- show loading state on the publish button
- on success navigate to `/community` with a refresh flag in `state` or session

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test -- --run src/test/publish-page-real.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PublishPage.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/publish-page-real.test.tsx
git commit -m "feat: submit community posts"
```

---

## Chunk 4: Post Detail, Comments, and Like

### Task 5: Load real post detail and comments

**Files:**
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/post-detail-page-real.test.tsx`

- [ ] **Step 1: Write the failing test**

Cover:
- page reads `postId` from route state
- loads `getPostDetail(postId)` and `listPostComments(postId)`
- renders backend content and comment list
- shows empty comment state when no comments

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/post-detail-page-real.test.tsx`
Expected: FAIL because page still uses seed content/comments.

- [ ] **Step 3: Write minimal implementation**

Update detail page to:
- replace static post body with fetched post detail
- replace seed comments with fetched comments
- use fallback author label `用户 #<id>` / `User #<id>`
- keep fixed composer and share sheet structure unchanged

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test -- --run src/test/post-detail-page-real.test.tsx`
Expected: partial PASS or next failure on comments/likes.

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/post-detail-page-real.test.tsx
git commit -m "feat: load post detail and comments"
```

### Task 6: Wire real comment publishing and like toggle

**Files:**
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx`
- Modify: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/post-detail-page-real.test.tsx`
- Test: `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/community-page-real.test.tsx`

- [ ] **Step 1: Write the failing test**

Cover:
- sending a comment calls `createPostComment`
- success inserts the new comment into the rendered list
- tapping like calls `togglePostLike`
- like count and active state update correctly on success

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/test/post-detail-page-real.test.tsx src/test/community-page-real.test.tsx`
Expected: FAIL because comment and like actions are still local UI only.

- [ ] **Step 3: Write minimal implementation**

Implement:
- detail-page comment submit with pending state
- local prepend of created comment response
- detail-page like toggle against backend
- community-card like toggle against backend
- optimistic UI allowed, but rollback on error

- [ ] **Step 4: Run tests to verify it passes**

Run: `npm test -- --run src/test/post-detail-page-real.test.tsx src/test/community-page-real.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/PostDetailPage.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/pages/CommunityPage.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/post-detail-page-real.test.tsx /Users/Zhuanz1/Documents/Playground/bug-sight-studio/src/test/community-page-real.test.tsx
git commit -m "feat: enable community comments and likes"
```

---

## Chunk 5: Final Verification

### Task 7: Run regression checks and manual flow

**Files:**
- No code changes required unless verification finds issues

- [ ] **Step 1: Run targeted tests**

Run:
```bash
cd /Users/Zhuanz1/Documents/Playground/bug-sight-studio
npm test -- --run src/test/community-page-real.test.tsx src/test/publish-page-real.test.tsx src/test/post-detail-page-real.test.tsx
```
Expected: PASS

- [ ] **Step 2: Run broader frontend regression**

Run:
```bash
cd /Users/Zhuanz1/Documents/Playground/bug-sight-studio
npm test
```
Expected: PASS

- [ ] **Step 3: Run production build**

Run:
```bash
cd /Users/Zhuanz1/Documents/Playground/bug-sight-studio
npm run build
```
Expected: PASS

- [ ] **Step 4: Manual verification**

Verify:
1. 社区页能拉到真实帖子
2. 切换推荐/最新可刷新内容
3. 发布新帖子成功后返回列表
4. 动态详情显示真实评论
5. 评论成功后立即出现
6. 点赞数量能更新

- [ ] **Step 5: Commit final fixes**

```bash
git add -A
git commit -m "feat: connect community flow to backend"
```
