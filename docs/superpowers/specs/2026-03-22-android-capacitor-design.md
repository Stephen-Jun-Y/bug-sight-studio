# Android Capacitor 接入设计文档

## 目标

将现有 `Vite + React` 前端项目接入 Capacitor，生成 Android 工程，并在本机 Android 构建环境可用的前提下尝试产出可安装的 APK。

## 已确认前提

- 前端项目路径：`/Users/Zhuanz1/Documents/Playground/bug-sight-studio`
- 项目技术栈：Vite + React
- Android App ID：`com.bugsight.app`
- 应用名：`BugSight`
- 当前前端 API 主要指向云端后端，而不是本地 `localhost`

## 方案选择

采用 **Capacitor + 本地打包 `dist` 到 Android WebView** 的方案：

- 构建时仍使用现有 `npm run build`
- Capacitor 的 `webDir` 指向 `dist`
- 生成 `android/` 工程供 Android Studio / Gradle 使用
- Android 端增加开发可用的 cleartext 配置，以兼容当前 HTTP API

## 范围

本轮会完成：

1. 安装 Capacitor 依赖
2. 初始化 Capacitor 配置
3. 生成 Android 工程
4. 配置 `appId = com.bugsight.app`
5. 配置 `appName = BugSight`
6. 配置 `webDir = dist`
7. 同步 web 构建产物到 Android
8. 若本机 Android SDK 可用，则尝试直接构建 debug APK
9. 补一份安卓打包说明文档

## 不在本轮范围内

- 应用图标 / 启动图完整定制
- Google Play 上架签名
- Release AAB 正式发版配置
- 原生插件（相机、推送、文件选择器）扩展接入

## 关键风险

### 1. Android SDK 可能缺失
当前已确认：
- Java 已安装
- `adb` 未找到
- `ANDROID_HOME` / `ANDROID_SDK_ROOT` 未配置

因此：
- Capacitor 和 Android 工程大概率可接入成功
- 是否能直接生成 APK 取决于机器是否已有 Android Studio / SDK 或可快速补齐

### 2. 当前 API 为 HTTP
前端当前默认 API 不是 HTTPS。
Android 9+ 对明文流量有限制，因此这轮会优先补开发可用配置，确保 APK 调试阶段可访问当前服务。

## 验收标准

满足以下任一层级即视为成功：

### Level 1：接入成功
- `capacitor.config.*` 存在并配置正确
- `android/` 工程生成成功
- `npm run build` 与 `npx cap sync android` 成功

### Level 2：APK 成功
在 Level 1 基础上：
- 本机 Gradle 构建成功
- 生成 `app-debug.apk`
- APK 被复制到项目内约定目录，便于后续分发测试

## 输出位置

如果 APK 构建成功，优先放到：
- `/Users/Zhuanz1/Documents/Playground/bug-sight-studio/build-artifacts/android/`

