# Native Layout Adaptation Design

## Goal

Make the app feel like a real full-screen mobile application on both browser and Android builds by removing web-demo layout assumptions and standardizing safe-area handling.

## Scope

- Convert `MobileLayout` into a pure full-screen page shell.
- Standardize top/bottom safe-area behavior in shared layout utilities.
- Update shared chrome (`PageHeader`, `TabBar`) to stop relying on hard-coded offsets.
- Fix immersive pages (`OnboardingPage`, `ScanPage`) so their background, action buttons, and bottom action areas fill and align correctly on real devices.

## Design

### 1. Layout shell
- `MobileLayout` should own only viewport sizing and clipping.
- It should no longer inject fake phone chrome, fixed padding, or global safe-area padding.
- Pages decide whether they are scrollable, immersive, or content-first.

### 2. Safe-area utilities
- Add explicit utility classes in `src/index.css` for:
  - top inset
  - bottom inset
  - bottom navigation reserve space
  - immersive action rows
- Shared components consume these utilities instead of hard-coded `pt-14`, `top-14`, or `pb-24` style values.

### 3. Shared chrome
- `PageHeader` becomes safe-area aware and keeps a stable content row height.
- `TabBar` keeps its current visual style, but uses safe-area bottom padding and should not overlap content unexpectedly.
- Content pages with bottom navigation should reserve tab bar height using a shared pattern instead of per-page guesses.

### 4. Immersive pages
- `OnboardingPage` and `ScanPage` should use full-height containers tied to the viewport.
- Their top action buttons should sit below the real status bar via safe-area utilities.
- Their bottom control areas should combine visual padding with the bottom safe-area inset.

## Validation

- Browser onboarding page fills the viewport without white framing.
- Android onboarding and scan screens fill the screen and keep controls out of the status bar / gesture area.
- Existing non-immersive pages keep working with the shared header/tab bar updates.
