#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ANDROID_DIR="${PROJECT_ROOT}/android"
OUTPUT_DIR="${PROJECT_ROOT}/build-artifacts/android"
SOURCE_APK="${ANDROID_DIR}/app/build/outputs/apk/debug/app-debug.apk"
DEFAULT_JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
MIN_FREE_KB=3145728
BUILD_MODE="${BUILD_MODE:-production}"

case "${BUILD_MODE}" in
  production)
    SYNC_CMD="npm run android:sync:prod"
    OUTPUT_APK="${OUTPUT_DIR}/BugSight-debug-production.apk"
    ;;
  development)
    SYNC_CMD="npm run android:sync:dev"
    OUTPUT_APK="${OUTPUT_DIR}/BugSight-debug-development.apk"
    ;;
  *)
    fail "不支持的 BUILD_MODE=${BUILD_MODE}，仅支持 development 或 production"
    ;;
esac

log() {
  printf '\n==> %s\n' "$1"
}

fail() {
  printf '\n[build-android-debug] %s\n' "$1" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "缺少命令: $1"
}

resolve_java_home() {
  if [[ -n "${JAVA_HOME:-}" ]] && [[ -x "${JAVA_HOME}/bin/java" ]]; then
    if "${JAVA_HOME}/bin/java" -version 2>&1 | grep -q 'version "21'; then
      printf '%s\n' "${JAVA_HOME}"
      return 0
    fi
  fi

  if [[ -x "${DEFAULT_JAVA_HOME}/bin/java" ]]; then
    printf '%s\n' "${DEFAULT_JAVA_HOME}"
    return 0
  fi

  if [[ -x "/usr/libexec/java_home" ]]; then
    local detected
    detected="$(/usr/libexec/java_home -v 21 2>/dev/null || true)"
    if [[ -n "${detected}" ]]; then
      printf '%s\n' "${detected}"
      return 0
    fi
  fi

  return 1
}

check_disk_space() {
  local available_kb
  available_kb="$(df -Pk "${PROJECT_ROOT}" | awk 'NR==2 {print $4}')"
  if [[ -z "${available_kb}" ]]; then
    fail "无法检查磁盘剩余空间"
  fi

  if (( available_kb < MIN_FREE_KB )); then
    fail "磁盘可用空间不足 3GB，请先清理缓存后再构建"
  fi
}

require_cmd npm
require_cmd npx

[[ -d "${ANDROID_DIR}" ]] || fail "未找到 Android 工程目录: ${ANDROID_DIR}"

JAVA_HOME_RESOLVED="$(resolve_java_home || true)"
[[ -n "${JAVA_HOME_RESOLVED}" ]] || fail "未找到 JDK 21，请先安装 openjdk@21 或设置 JAVA_HOME"
export JAVA_HOME="${JAVA_HOME_RESOLVED}"

log "使用 Java"
"${JAVA_HOME}/bin/java" -version

check_disk_space

log "同步前端资源到 Android (${BUILD_MODE})"
(
  cd "${PROJECT_ROOT}"
  ${SYNC_CMD}
)

log "构建 Android Debug APK"
(
  cd "${ANDROID_DIR}"
  ./gradlew assembleDebug --console=plain
)

[[ -f "${SOURCE_APK}" ]] || fail "未找到生成的 APK: ${SOURCE_APK}"

log "复制 APK 到项目产物目录"
mkdir -p "${OUTPUT_DIR}"
cp "${SOURCE_APK}" "${OUTPUT_APK}"

# 保留一个稳定文件名，方便直接安装当前最新构建
cp "${SOURCE_APK}" "${OUTPUT_DIR}/BugSight-debug.apk"

printf '\nAPK 已生成:\n'
ls -lh "${OUTPUT_APK}"
