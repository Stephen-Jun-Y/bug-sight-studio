# BugSight Android 打包说明

## 已接入内容

- Capacitor Android
- App ID: `com.bugsight.app`
- App Name: `BugSight`
- Web 资源目录: `dist`

## 常用命令

```bash
npm run build
npm run build:prod
npm run android:sync
npm run android:sync:prod
npm run android:apk
npm run android:apk:dev
npm run android:open
```

## 说明

- `android:sync` 会先执行前端构建，再把 `dist` 同步到 Android 工程。
- `android:apk` 默认打正式环境 APK，读取 `/.env.production`，连接服务器后端。
- `android:apk:dev` 打开发环境 APK，读取 `/.env.development`，连接本地后端。
- 构建后的 APK 会复制到：
  - `build-artifacts/android/BugSight-debug-production.apk`
  - `build-artifacts/android/BugSight-debug-development.apk`
  - 同时保留一个最新包：`build-artifacts/android/BugSight-debug.apk`
- 如果本机 Android SDK 完整，可在 Android Studio 中直接运行或打包 APK。
- 如果命令行构建成功，APK 会优先复制到 `build-artifacts/android/`。
