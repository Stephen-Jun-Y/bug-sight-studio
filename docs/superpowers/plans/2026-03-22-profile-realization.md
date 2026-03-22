# Profile Realization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the profile/settings area use the real `/users/me` backend APIs, real recognition-derived stats, real password/account actions, and downgrade phone binding to a clear unavailable state.

**Architecture:** Keep the current route structure and UI layout, then replace prototype-only behavior with minimal real data wiring. Add a focused `user-service`, extend local auth helpers for cache syncing, and update profile-related pages to load/submit real data while preserving the current styling and navigation patterns.

**Tech Stack:** React, TypeScript, React Router, Vitest, Testing Library, existing `request()` API client, Spring Boot `/users/me` APIs.

---

## File Map

### Create
- `src/services/user-service.ts` — wraps `/users/me`, `/users/me/password`, `/users/me` delete requests.
- `src/test/profile-page.test.tsx` — verifies profile data loading, computed stats, and logout behavior.
- `src/test/edit-profile-page.test.tsx` — verifies loading current profile and saving profile edits.
- `src/test/change-password-page.test.tsx` — verifies valid password submission payload.
- `src/test/settings-page-account.test.tsx` — verifies account deletion flow.
- `src/test/bind-phone-page.test.tsx` — verifies the unavailable-state copy.

### Modify
- `src/types/api.ts` — add user profile/update/password request types.
- `src/lib/auth.ts` — add helpers for reading/updating stored user data after profile changes.
- `src/pages/ProfilePage.tsx` — load `/users/me`, compute stats from recognition history, wire logout.
- `src/pages/EditProfilePage.tsx` — load current profile and persist updates.
- `src/pages/ChangePasswordPage.tsx` — submit the password change request.
- `src/pages/SettingsPage.tsx` — wire delete-account action and route copy updates.
- `src/pages/BindPhonePage.tsx` — replace fake bind flow with “coming soon / unavailable” state.

### Reuse
- `src/services/recognition-service.ts` — use the existing history endpoint for stats.
- `src/lib/language.tsx` — continue using `t()` and existing common error translation.
- `src/components/ui/sonner.tsx` and `toast` usage patterns from other pages.

---

## Chunk 1: User Types And Service

### Task 1: Add user API types

**Files:**
- Modify: `src/types/api.ts`
- Test: `src/test/profile-page.test.tsx`

- [ ] **Step 1: Write the failing test scaffold**

Add a minimal compile-usage test setup in `src/test/profile-page.test.tsx` that imports the new profile types from `src/types/api.ts` via the page/service mocks. Use the same style as the existing page tests.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/profile-page.test.tsx`
Expected: FAIL because the profile types/service contracts do not exist yet.

- [ ] **Step 3: Add the minimal types**

In `src/types/api.ts`, add:
- `CurrentUserProfile`
- `UpdateCurrentUserProfileRequest`
- `ChangeCurrentUserPasswordRequest`

Match backend DTOs exactly:
- profile response: `id`, `nickname`, `bio`, `avatarUrl`, `location`
- update request: `nickname`, `bio`, `location`, `avatarUrl`
- password request: `currentPassword`, `newPassword`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/profile-page.test.tsx`
Expected: test moves past missing-type failure (it may still fail later on missing page logic).

- [ ] **Step 5: Commit**

```bash
git add src/types/api.ts src/test/profile-page.test.tsx
git commit -m "feat: add user profile api types"
```

### Task 2: Add `user-service`

**Files:**
- Create: `src/services/user-service.ts`
- Test: `src/test/edit-profile-page.test.tsx`

- [ ] **Step 1: Write the failing test**

In `src/test/edit-profile-page.test.tsx`, mock a missing `user-service` import and write a test that expects:
- page load calls `getCurrentUserProfile()`
- save calls `updateCurrentUserProfile()` with edited form fields

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: FAIL because `user-service.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `src/services/user-service.ts` with:
- `getCurrentUserProfile()` -> `request<CurrentUserProfile>("/users/me")`
- `updateCurrentUserProfile(payload)` -> `request<CurrentUserProfile>("/users/me", { method: "PATCH", body: payload })`
- `changeCurrentUserPassword(payload)` -> `request<{ success: boolean }>("/users/me/password", { method: "POST", body: payload })`
- `deleteCurrentUser()` -> `request<void>("/users/me", { method: "DELETE" })`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: test now fails later on page behavior rather than missing service.

- [ ] **Step 5: Commit**

```bash
git add src/services/user-service.ts src/test/edit-profile-page.test.tsx
git commit -m "feat: add user account service"
```

---

## Chunk 2: Local Auth Cache Sync

### Task 3: Add stored-user helpers

**Files:**
- Modify: `src/lib/auth.ts`
- Test: `src/test/edit-profile-page.test.tsx`

- [ ] **Step 1: Extend the failing test**

In `src/test/edit-profile-page.test.tsx`, after successful save, expect the page flow to update local cached user info so later reads use the new nickname.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: FAIL because there is no helper to update the stored user cache.

- [ ] **Step 3: Write minimal implementation**

Add to `src/lib/auth.ts`:
- `getStoredUser()` — parse and return the current local cached user safely
- `updateStoredUser(partial)` — merge into `USER_KEY` if a cached user exists, preserving `id`

Keep existing helpers intact:
- `saveAuth()`
- `clearAuth()`
- `getStoredNickname()`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: cache-sync-related assertion can now pass once the page is wired.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth.ts src/test/edit-profile-page.test.tsx
git commit -m "feat: add auth cache sync helpers"
```

---

## Chunk 3: Profile Page Real Data

### Task 4: Realize profile header and stats

**Files:**
- Modify: `src/pages/ProfilePage.tsx`
- Test: `src/test/profile-page.test.tsx`
- Reuse: `src/services/user-service.ts`, `src/services/recognition-service.ts`, `src/lib/auth.ts`

- [ ] **Step 1: Write the failing test**

In `src/test/profile-page.test.tsx`, verify:
- page calls `getCurrentUserProfile()`
- page calls `listRecognitionHistory({ page: 1, pageSize: 100 })`
- renders nickname from backend
- computes stats:
  - unique `species.id` count
  - unique non-empty `location` count
  - unique observation-date count
- clicking the bottom logout button clears auth and navigates to `/auth`

Use a small `recognitions` fixture with deliberate duplicates.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/profile-page.test.tsx`
Expected: FAIL because `ProfilePage` still uses hard-coded values.

- [ ] **Step 3: Write minimal implementation**

In `src/pages/ProfilePage.tsx`:
- load current user profile in `useEffect`
- load recognition history in the same page for stats (page 1, pageSize 100)
- compute:
  - species count = unique `species.id`
  - places count = unique truthy `location.trim()`
  - days count = unique `capturedAt.slice(0, 10)` or equivalent normalized date
- render loading-safe fallbacks instead of hard-coded `128/23/56`
- replace hard-coded subtitle with derived text
- wire logout button to `clearAuth()` + `navigate("/auth", { replace: true })`

Keep existing menu structure and styling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/profile-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProfilePage.tsx src/test/profile-page.test.tsx
git commit -m "feat: load real profile data and stats"
```

---

## Chunk 4: Edit Profile Flow

### Task 5: Load and save profile edits

**Files:**
- Modify: `src/pages/EditProfilePage.tsx`
- Test: `src/test/edit-profile-page.test.tsx`
- Reuse: `src/services/user-service.ts`, `src/lib/auth.ts`

- [ ] **Step 1: Write the failing test**

In `src/test/edit-profile-page.test.tsx`, verify:
- load fills nickname/bio/location from `getCurrentUserProfile()`
- clicking save calls `updateCurrentUserProfile()` with edited values
- success calls `updateStoredUser()` with the returned profile fields
- success navigates back to `/profile` (or `navigate(-1)` if that is the chosen existing pattern; pick one and test for it)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: FAIL because the page still uses static defaults.

- [ ] **Step 3: Write minimal implementation**

In `src/pages/EditProfilePage.tsx`:
- convert uncontrolled defaults to controlled state
- load current profile on mount
- bind save button to async submit
- call `updateCurrentUserProfile({ nickname, bio, location })`
- on success, call `updateStoredUser({ nickname, avatarUrl })`
- show toast success/failure
- navigate back to `/profile`

Do not add avatar upload; keep the existing avatar placeholder.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/edit-profile-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/EditProfilePage.tsx src/test/edit-profile-page.test.tsx
git commit -m "feat: connect edit profile form"
```

---

## Chunk 5: Change Password Flow

### Task 6: Submit password changes

**Files:**
- Modify: `src/pages/ChangePasswordPage.tsx`
- Test: `src/test/change-password-page.test.tsx`
- Reuse: `src/services/user-service.ts`

- [ ] **Step 1: Write the failing test**

In `src/test/change-password-page.test.tsx`, verify:
- entering valid current/new/confirm passwords enables submit
- clicking submit calls `changeCurrentUserPassword({ currentPassword, newPassword })`
- success navigates back to `/settings`

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/change-password-page.test.tsx`
Expected: FAIL because the page does not submit anything yet.

- [ ] **Step 3: Write minimal implementation**

In `src/pages/ChangePasswordPage.tsx`:
- keep existing password strength rules and confirm-password checks
- add submit handler calling `changeCurrentUserPassword()`
- disable while submitting
- on success: toast + navigate(`/settings`)
- on failure: toast error and stay on page

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/change-password-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ChangePasswordPage.tsx src/test/change-password-page.test.tsx
git commit -m "feat: connect change password form"
```

---

## Chunk 6: Settings, Delete Account, And Bind Phone Downgrade

### Task 7: Wire delete-account action in settings

**Files:**
- Modify: `src/pages/SettingsPage.tsx`
- Test: `src/test/settings-page-account.test.tsx`
- Reuse: `src/services/user-service.ts`, `src/lib/auth.ts`

- [ ] **Step 1: Write the failing test**

In `src/test/settings-page-account.test.tsx`, verify:
- clicking the delete-account button triggers a confirmation step
- confirming calls `deleteCurrentUser()`
- success calls `clearAuth()` and navigates to `/auth`

Mock confirmation in the simplest stable way (for example by mocking `window.confirm`).

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/settings-page-account.test.tsx`
Expected: FAIL because the button is currently inert.

- [ ] **Step 3: Write minimal implementation**

In `src/pages/SettingsPage.tsx`:
- keep existing settings groups and language toggle
- keep “绑定手机” as a nav item to `/bind-phone`
- wire “注销账号” button to:
  - `window.confirm(...)`
  - `deleteCurrentUser()`
  - `clearAuth()`
  - `navigate("/auth", { replace: true })`
- optionally also wire a visible “退出登录” action here if it improves consistency, but do not duplicate complex state

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/settings-page-account.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/SettingsPage.tsx src/test/settings-page-account.test.tsx
git commit -m "feat: connect account deletion in settings"
```

### Task 8: Replace bind-phone fake flow with unavailable state

**Files:**
- Modify: `src/pages/BindPhonePage.tsx`
- Test: `src/test/bind-phone-page.test.tsx`

- [ ] **Step 1: Write the failing test**

In `src/test/bind-phone-page.test.tsx`, verify the page renders a clear unavailable-state message such as:
- Chinese: `暂未开放`
- English: `Coming soon` or `Not available yet`

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/test/bind-phone-page.test.tsx`
Expected: FAIL because the page still renders the fake binding UI.

- [ ] **Step 3: Write minimal implementation**

In `src/pages/BindPhonePage.tsx`:
- remove the fake bound/unbound interaction branches
- replace with a simple explanation card:
  - feature unavailable now
  - future support for phone-based recovery/security checks
- keep current page shell and styling tone

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/test/bind-phone-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/BindPhonePage.tsx src/test/bind-phone-page.test.tsx
git commit -m "feat: mark phone binding as unavailable"
```

---

## Chunk 7: Final Verification

### Task 9: Run focused regression checks

**Files:**
- Test: `src/test/profile-page.test.tsx`
- Test: `src/test/edit-profile-page.test.tsx`
- Test: `src/test/change-password-page.test.tsx`
- Test: `src/test/settings-page-account.test.tsx`
- Test: `src/test/bind-phone-page.test.tsx`

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm test -- src/test/profile-page.test.tsx src/test/edit-profile-page.test.tsx src/test/change-password-page.test.tsx src/test/settings-page-account.test.tsx src/test/bind-phone-page.test.tsx
```

Expected: all new B-related tests pass.

- [ ] **Step 2: Fix any failures minimally**

Only patch the failing behavior; do not refactor unrelated pages.

- [ ] **Step 3: Commit focused fixes if needed**

```bash
git add <changed-files>
git commit -m "test: stabilize profile account flows"
```

### Task 10: Run full verification

**Files:**
- Test: full frontend suite
- Build: frontend production bundle

- [ ] **Step 1: Run the full frontend test suite**

Run:

```bash
npm test
```

Expected: all frontend tests pass.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: successful build; existing chunk-size warning is acceptable if unchanged.

- [ ] **Step 3: Manual smoke-check after implementation**

Run the local app and verify:
- `/profile` shows real nickname and computed stats
- `/edit-profile` saves and returns updated nickname
- `/change-password` submits successfully
- `/settings` delete-account flow works
- `/bind-phone` clearly says unavailable

- [ ] **Step 4: Commit final verified state**

```bash
git add src/pages src/services src/lib src/types src/test
git commit -m "feat: realize profile account management flows"
```

---

## Notes For Execution

- Keep diffs small and page-local.
- Do not invent a new backend endpoint for stats; use `listRecognitionHistory()`.
- Do not add avatar upload in this iteration.
- Preserve existing bilingual display patterns through `t()`.
- If a page needs both current profile data and navigation state, prefer a small local `useEffect` over adding a new global store.
