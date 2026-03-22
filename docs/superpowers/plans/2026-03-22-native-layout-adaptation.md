# Native Layout Adaptation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the app render as a true full-screen mobile experience on browser and Android by standardizing layout shell, safe-area handling, shared chrome, and immersive screens.

**Architecture:** Keep the existing page structure, but shift device-aware spacing into shared layout primitives. `MobileLayout` becomes a neutral full-screen shell, `PageHeader` and `TabBar` consume shared safe-area utilities, and immersive pages explicitly manage top/bottom overlays.

**Tech Stack:** React, Vite, Tailwind CSS, Vitest, Capacitor Android

---

## Chunk 1: Layout shell and regression tests

### Task 1: Lock the new `MobileLayout` contract with tests

**Files:**
- Modify: `src/test/mobile-layout.test.tsx`
- Test: `src/test/mobile-layout.test.tsx`

- [ ] Add assertions that `MobileLayout` renders `h-dvh`, `min-h-dvh`, and no preview-shell classes.
- [ ] Run: `npm test -- --run src/test/mobile-layout.test.tsx`
- [ ] Verify the test fails before implementation if the shell contract regresses.

### Task 2: Keep `MobileLayout` as a pure full-screen shell

**Files:**
- Modify: `src/components/MobileLayout.tsx`
- Test: `src/test/mobile-layout.test.tsx`

- [ ] Update `MobileLayout` so it only owns viewport sizing, overflow clipping, and child rendering.
- [ ] Run: `npm test -- --run src/test/mobile-layout.test.tsx`
- [ ] Verify the test passes.

## Chunk 2: Shared safe-area and chrome

### Task 3: Add reusable safe-area utilities

**Files:**
- Modify: `src/index.css`

- [ ] Add utilities for top safe-area, bottom safe-area, bottom nav reserve space, and immersive action padding.
- [ ] Remove remaining global browser defaults that cause white framing.

### Task 4: Make `PageHeader` safe-area aware

**Files:**
- Modify: `src/components/PageHeader.tsx`
- Create/Modify Test: `src/test/page-header-layout.test.tsx`

- [ ] Write a failing test that ensures `PageHeader` no longer depends on `pt-14`.
- [ ] Update `PageHeader` to use shared safe-area utilities and a stable content row height.
- [ ] Run: `npm test -- --run src/test/page-header-layout.test.tsx`

### Task 5: Make `TabBar` safe-area aware

**Files:**
- Modify: `src/components/TabBar.tsx`
- Create/Modify Test: `src/test/tab-bar-layout.test.tsx`

- [ ] Write a failing test that ensures `TabBar` uses bottom safe-area utilities instead of hard-coded bottom spacing.
- [ ] Update `TabBar` bottom padding and inner layout.
- [ ] Run: `npm test -- --run src/test/tab-bar-layout.test.tsx`

## Chunk 3: Immersive pages

### Task 6: Fix onboarding full-screen rendering

**Files:**
- Modify: `src/pages/OnboardingPage.tsx`
- Create/Modify Test: `src/test/onboarding-layout.test.tsx`

- [ ] Write a failing test to assert the page uses full-height layout and safe-area-aware top/bottom controls.
- [ ] Update onboarding background, skip button, and CTA container layout.
- [ ] Run: `npm test -- --run src/test/onboarding-layout.test.tsx`

### Task 7: Fix scan page full-screen rendering

**Files:**
- Modify: `src/pages/ScanPage.tsx`
- Create/Modify Test: `src/test/scan-layout.test.tsx`

- [ ] Write a failing test to assert top controls and bottom action area use shared safe-area classes.
- [ ] Update camera, preview, and scanning states to fill the viewport consistently.
- [ ] Run: `npm test -- --run src/test/scan-layout.test.tsx`

## Chunk 4: Verification and Android packaging

### Task 8: Run focused regression tests

**Files:**
- Test: `src/test/mobile-layout.test.tsx`
- Test: `src/test/page-header-layout.test.tsx`
- Test: `src/test/tab-bar-layout.test.tsx`
- Test: `src/test/onboarding-layout.test.tsx`
- Test: `src/test/scan-layout.test.tsx`

- [ ] Run: `npm test -- --run src/test/mobile-layout.test.tsx src/test/page-header-layout.test.tsx src/test/tab-bar-layout.test.tsx src/test/onboarding-layout.test.tsx src/test/scan-layout.test.tsx`
- [ ] Verify all targeted tests pass.

### Task 9: Run production verification

**Files:**
- Verify only

- [ ] Run: `npm run build`
- [ ] Run: `npm run android:apk`
- [ ] Verify browser assets build and a fresh APK is emitted to `build-artifacts/android/BugSight-debug.apk`.
