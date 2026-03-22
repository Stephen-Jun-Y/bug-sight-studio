# Android Capacitor Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Capacitor into the Vite frontend, generate an Android project for `com.bugsight.app`, and produce a debug APK if the local Android toolchain is available.

**Architecture:** Keep the existing Vite build as the single web build source, point Capacitor at `dist`, then generate/sync Android native assets. Treat APK generation as environment-dependent: first scaffold and sync, then attempt Gradle build only if Android SDK tooling is present.

**Tech Stack:** Vite, React, Capacitor, Android Gradle, Java 17.

---

## File Map

### Create
- `capacitor.config.ts`
- `android/` (generated)
- `docs/android-capacitor-build.md`
- `build-artifacts/android/` (if APK build succeeds)

### Modify
- `package.json`
- possibly `.gitignore`

---

## Task 1: Install Capacitor and add project scripts
- [ ] Inspect existing package.json and preserve current scripts
- [ ] Install `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- [ ] Add minimal helper scripts if they improve repeatability, such as `android:sync`
- [ ] Run a dependency sanity check

## Task 2: Create Capacitor config
- [ ] Add `capacitor.config.ts`
- [ ] Set `appId` to `com.bugsight.app`
- [ ] Set `appName` to `BugSight`
- [ ] Set `webDir` to `dist`
- [ ] Keep config minimal; do not over-configure plugins not yet used

## Task 3: Generate Android project
- [ ] Run the Vite production build
- [ ] Add Android platform via Capacitor
- [ ] Sync web assets into Android
- [ ] Verify `android/` project files exist and reference the chosen app id

## Task 4: Handle Android networking for current backend assumptions
- [ ] Inspect generated Android config
- [ ] Add the smallest safe cleartext/dev configuration needed for current HTTP API access
- [ ] Avoid broad unrelated native changes

## Task 5: Attempt debug APK build
- [ ] Detect Android SDK / Gradle availability
- [ ] If available, run Gradle debug build
- [ ] If APK is generated, copy it into `build-artifacts/android/`
- [ ] If SDK is unavailable, document the exact blocker instead of guessing

## Task 6: Document the workflow
- [ ] Write `docs/android-capacitor-build.md`
- [ ] Include build, sync, open-in-Android-Studio, and APK path instructions
- [ ] If APK build is blocked, include the exact missing prerequisite and next command

## Verification
- [ ] Run `npm run build`
- [ ] Run Capacitor sync/add commands successfully
- [ ] If possible, run Android debug build successfully
- [ ] Report exact APK path or exact blocker
