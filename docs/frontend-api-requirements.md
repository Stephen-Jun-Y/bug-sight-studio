# 前端 API 需求清单（基于现有代码扫描）

## 1) 项目扫描结论

### 1.1 API 调用位置扫描
- 当前前端代码中**未发现真实网络请求实现**（未使用 `fetch` / `axios` / `react-query` 的 query/mutation 调用）。
- 业务页面主要采用本地 `useState` 与硬编码数组模拟数据流。
- 结论：后端重构与联调前，需先新增 API client 层（建议 `src/services` + `src/types` + `src/hooks/api`）。

### 1.2 数据类型定义扫描
- 当前仅有少量 UI 组件级 TypeScript 类型（例如按钮 props、页面局部 `type`），缺少统一业务实体类型（如 User、Post、RecognitionRecord、Species）。
- 结论：建议先补齐共享类型定义，以降低后续联调返工。

### 1.3 核心功能模块识别
- 认证与账号安全：登录/注册、修改密码、绑定手机、退出登录、注销账号。
- 昆虫识别主链路：拍照/预览/识别结果、相似物种、百科详情、收藏/分享/纠错。
- 搜索与知识库：关键词搜索、筛选条件、物种详情。
- 历史记录：列表、详情、编辑、删除、导出。
- 社区互动：动态流、发布、点赞、评论、分享、关注、用户主页。
- 个人中心：个人信息、收藏、成就、观察地图、通知、设置。

---

## 2) API 需求清单（按模块）

> 说明：以下端点为联调建议草案，采用 REST 风格；可按你后端规范改为 `/v1/...`、`/api/...` 或 GraphQL。

## 2.1 认证与用户

### A. 登录
- **Endpoint**: `POST /auth/login`
- **请求**
```json
{ "email": "user@example.com", "password": "string" }
```
- **响应**
```json
{ "accessToken": "jwt", "refreshToken": "jwt", "user": { "id": "u_1", "nickname": "自然探索者" } }
```

### B. 注册
- **Endpoint**: `POST /auth/register`
- **请求**
```json
{ "nickname": "string", "email": "user@example.com", "password": "string", "agreePolicy": true }
```
- **响应**
```json
{ "accessToken": "jwt", "refreshToken": "jwt", "user": { "id": "u_1", "nickname": "自然探索者" } }
```

### C. 获取当前用户信息
- **Endpoint**: `GET /users/me`
- **响应**
```json
{ "id": "u_1", "nickname": "自然探索者", "bio": "...", "avatarUrl": "...", "location": "北京" }
```

### D. 更新个人资料
- **Endpoint**: `PATCH /users/me`
- **请求**
```json
{ "nickname": "string", "bio": "string", "location": "string", "avatarUrl": "string" }
```
- **响应**：更新后的用户对象

### E. 修改密码
- **Endpoint**: `POST /users/me/password`
- **请求**
```json
{ "currentPassword": "string", "newPassword": "string" }
```
- **响应**
```json
{ "success": true }
```

### F. 手机绑定相关
- **发送验证码**: `POST /users/me/phone/verification-code`
- **确认绑定**: `POST /users/me/phone/bind`
- **换绑**: `POST /users/me/phone/change`
- **解绑**: `POST /users/me/phone/unbind`

### G. 注销账号 / 退出登录
- **退出登录**: `POST /auth/logout`
- **注销账号**: `DELETE /users/me`

---

## 2.2 识别与记录

### A. 上传识别图片
- **Endpoint**: `POST /recognitions`
- **请求**: `multipart/form-data`
  - `image`: file
  - `location`(可选), `capturedAt`(可选)
- **响应**
```json
{
  "recognitionId": "rec_1",
  "species": { "id": "sp_1", "name": "中华螳螂", "latinName": "Tenodera sinensis" },
  "confidence": 0.947,
  "similar": [{ "speciesId": "sp_2", "name": "大刀螳螂", "score": 0.783 }]
}
```

### B. 获取识别详情
- **Endpoint**: `GET /recognitions/{recognitionId}`
- **响应**：识别结果、百科摘要、可操作状态（是否已收藏等）

### C. 识别记录列表
- **Endpoint**: `GET /recognitions`
- **Query**: `page`, `pageSize`, `dateFrom`, `dateTo`, `keyword`

### D. 识别记录详情
- **Endpoint**: `GET /recognitions/{recognitionId}`

### E. 编辑记录
- **Endpoint**: `PATCH /recognitions/{recognitionId}`
- **请求**
```json
{ "note": "string", "location": "string", "capturedAt": "2024-03-10T14:32:00+08:00" }
```

### F. 删除记录
- **Endpoint**: `DELETE /recognitions/{recognitionId}`

### G. 记录导出
- **创建导出任务**: `POST /exports`
- **查询任务进度**: `GET /exports/{exportId}`
- **下载**: `GET /exports/{exportId}/download`

---

## 2.3 物种搜索与百科

### A. 热门搜索词
- **Endpoint**: `GET /search/hot-tags`

### B. 搜索历史
- **获取**: `GET /search/history`
- **新增**: `POST /search/history`
- **清空**: `DELETE /search/history`

### C. 物种搜索
- **Endpoint**: `GET /species/search`
- **Query**: `q`, `order`, `type[]`, `region[]`, `protectionLevel[]`, `sizeMin`, `sizeMax`, `page`, `pageSize`

### D. 物种详情（百科）
- **Endpoint**: `GET /species/{speciesId}`

### E. 相似物种
- **Endpoint**: `GET /species/{speciesId}/similar`

### F. 识别纠错/报告
- **Endpoint**: `POST /recognitions/{recognitionId}/reports`
- **请求**
```json
{ "reason": "misidentified", "comment": "string" }
```

---

## 2.4 收藏、点赞、分享

### A. 收藏物种/记录
- **添加收藏**: `POST /favorites`
- **取消收藏**: `DELETE /favorites/{favoriteId}`
- **收藏列表**: `GET /favorites`

### B. 点赞（动态 / 评论）
- **点赞**: `POST /likes`
- **取消点赞**: `DELETE /likes/{likeId}`

### C. 分享追踪（可选）
- **Endpoint**: `POST /shares`
- 用于统计分享次数而不是执行真实分享动作。

---

## 2.5 社区与互动

### A. 动态流
- **Endpoint**: `GET /posts`
- **Query**: `tab=recommend|following|latest`, `page`, `pageSize`

### B. 发布动态
- **Endpoint**: `POST /posts`
- **请求**（multipart 或 JSON）
```json
{ "content": "string", "media": ["url"], "topics": ["昆虫"], "location": "北京", "privacy": "public" }
```

### C. 动态详情
- **Endpoint**: `GET /posts/{postId}`

### D. 评论
- **获取评论**: `GET /posts/{postId}/comments`
- **新增评论**: `POST /posts/{postId}/comments`
- **回复评论**: `POST /comments/{commentId}/replies`

### E. 关注系统
- **关注用户**: `POST /follows`
- **取消关注**: `DELETE /follows/{followId}`
- **用户资料页**: `GET /users/{userId}`

### F. 通知
- **通知列表**: `GET /notifications?tab=all|interaction|system`
- **标记已读**: `POST /notifications/read`

---

## 2.6 设置与偏好

### A. 通知开关
- **获取设置**: `GET /users/me/settings`
- **更新设置**: `PATCH /users/me/settings`

### B. 清除缓存（服务端可选）
- 若缓存仅本地，可前端直接做；若有云端缓存可提供：`POST /users/me/cache/clear`

---

## 3) 前端已实现但后端高概率缺失的能力（联调风险清单）

1. **完整识别链路 API 缺失**：当前扫描页与结果页是纯前端模拟进度与静态结果，尚未对接上传识别与结果查询。
2. **社区写操作缺失**：点赞、评论、发布、关注目前都在本地状态模拟。
3. **账号安全操作缺失**：修改密码、绑定/换绑/解绑手机号按钮已存在但未调用后端。
4. **搜索与筛选能力缺失**：热门词、搜索历史、复杂筛选尚无后端接口。
5. **导出流程缺失**：导出任务进度与下载当前为前端动画，需后端异步任务支持。
6. **通知中心缺失**：消息列表/已读状态仅静态数据，缺少真实未读计数与分类接口。
7. **统一类型与错误码契约缺失**：目前没有前后端共享 schema，建议尽快制定 OpenAPI 或 Zod 合约。

---

## 4) 建议的最小联调优先级（MVP）

1. `auth/login`, `auth/register`, `users/me`
2. `POST /recognitions`, `GET /recognitions`, `GET /recognitions/{id}`
3. `GET /species/search`, `GET /species/{id}`, `GET /species/{id}/similar`
4. `GET /posts`, `POST /posts`, `POST /posts/{id}/comments`, `POST /likes`
5. `GET /notifications`, `PATCH /users/me/settings`

