# BugSight 前端联调对接说明（可直接执行）

## 1. 后端环境
- Base URL：`http://124.221.209.129:8080/api/v1`
- 健康检查：`GET /health`
- 统一响应：
```json
{ "code": 0, "message": "ok", "data": {} }
```
> 前端必须从 `data` 读取业务字段。

## 2. 前端环境变量
在 `.env` 中配置：
```bash
VITE_API_BASE=http://124.221.209.129:8080/api/v1
```

## 3. 登录/注册（重点）

### 注册
- `POST /auth/register`
```json
{
  "nickname": "自然探索者",
  "email": "user@example.com",
  "password": "12345678",
  "agreePolicy": true
}
```

### 登录
- `POST /auth/login`
```json
{
  "email": "user@example.com",
  "password": "12345678"
}
```

### 登录/注册响应（`data` 内）
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "token": "...",
  "userId": 1,
  "nickname": "...",
  "avatarUrl": "",
  "user": {
    "id": 1,
    "nickname": "...",
    "avatarUrl": ""
  }
}
```

约定：
- 前端统一使用 `accessToken`（`token` 为兼容字段）。
- 后续接口统一带 `Authorization: Bearer <accessToken>`。

## 4. 用户中心接口
- `GET /users/me`
- `PATCH /users/me`
- `POST /users/me/password`
- `DELETE /users/me`

## 5. 核心业务接口
- 识别：`POST /recognitions`、`GET /recognitions`、`GET/PATCH/DELETE /recognitions/{id}`
- 物种：`GET /species/search`、`GET /species/{id}`、`GET /species/{id}/similar`
- 收藏：`GET /favorites`、`POST/DELETE /favorites/{insectId}`、`POST /favorites/{insectId}/toggle`、`GET /favorites/{insectId}/status`
- 社区：`GET /posts`、`GET /posts/{id}/comments`、`POST /posts/{id}/comments`

## 6. 分页规范
- 请求：`page + pageSize`（兼容 `size`）
- 响应（在 `data` 内）：
```json
{ "list": [], "total": 0, "page": 1, "size": 20 }
```

## 7. 本次已完成前端改造（对应 7 项）
1. API client 使用 `VITE_API_BASE`。
2. 请求自动注入 `Authorization`。
3. 登录/注册后持久化 `data.accessToken`（兼容 `data.token`）。
4. 响应统一从 `res.data`（即 envelope 的 `data`）读取业务值。
5. 提供统一分页参数工具：`page/pageSize`。
6. 注册请求使用 `nickname + agreePolicy`。
7. 页面昵称读取优先 `nickname`（从登录态本地缓存读取）。

## 8. 暂未覆盖接口（先 mock）
- `/users/me/phone/*`
- `/exports/*`
- `/search/hot-tags`、`/search/history`
- `/notifications*`
- `/likes`、`/follows`

## 9. 联调执行顺序建议
1) 先用 `/health` + `/auth/login` 验证网络与 token 存储。  
2) 接入 `/users/me` 并回填个人信息。  
3) 接入识别列表 `/recognitions`（分页）再接详情与编辑。  
4) 接入物种检索 `/species/search`，最后接社区评论。
