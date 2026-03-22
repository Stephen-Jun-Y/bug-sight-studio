# Search, History, Favorites Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect search, history records, record detail/edit/delete, and favorites to the real backend APIs while keeping the current UI structure largely unchanged.

**Architecture:** Reuse the existing page routes and visual layout, replacing static mock data with small service calls and page-local loading/error/empty states. Keep all changes on the frontend side, assuming current backend endpoints remain the source of truth.

**Tech Stack:** React, TypeScript, Vite, existing request client, existing Spring Boot API contracts.

---

## File map

### Create
- `src/services/favorite-service.ts` - favorites list, toggle, status API wrapper

### Modify
- `src/types/api.ts` - add paged history types, record detail/update types, favorite state types, search paging types
- `src/services/species-service.ts` - add species search wrapper
- `src/services/recognition-service.ts` - add history list/detail/update/delete wrappers
- `src/pages/SearchPage.tsx` - replace static search results with `/species/search`
- `src/pages/HistoryPage.tsx` - replace static grouped history with real `/recognitions`
- `src/pages/RecordDetailPage.tsx` - fetch record detail by `recognitionId`
- `src/pages/EditRecordPage.tsx` - patch record note/location/time and handle save state
- `src/pages/FavoritesPage.tsx` - load `/favorites` and render real cards
- `src/pages/ResultPage.tsx` - check favorite status and toggle favorites

### Test / verify
- Existing frontend tests as regression safety: `npm test`
- Frontend production build: `npm run build`
- Manual end-to-end local verification using the local dev script

---

## Chunk 1: API and types

### Task 1: Extend API types

**Files:**
- Modify: `src/types/api.ts`

- [ ] **Step 1: Add the failing shape assumptions locally**
Define types for paged species search, paged recognition history, record detail/edit payload, and favorite status responses.

- [ ] **Step 2: Verify type references fail before implementation if pages import missing types**
Run: `npm test -- --runInBand`
Expected: if new imports are added before types exist, TypeScript/test build fails.

- [ ] **Step 3: Add minimal type definitions**
Include only fields that current pages need, avoiding speculative over-modeling.

- [ ] **Step 4: Re-run frontend tests**
Run: `npm test -- --runInBand`
Expected: existing tests stay green.

### Task 2: Add service wrappers

**Files:**
- Create: `src/services/favorite-service.ts`
- Modify: `src/services/species-service.ts`
- Modify: `src/services/recognition-service.ts`

- [ ] **Step 1: Add species search wrapper**
Use `/species/search?q=&page=&pageSize=`.

- [ ] **Step 2: Add recognition history wrappers**
Add list/detail/update/delete helpers around `/recognitions`.

- [ ] **Step 3: Add favorite service wrappers**
Add list/status/toggle helpers around `/favorites`.

- [ ] **Step 4: Verify tests/build still compile**
Run: `npm test -- --runInBand`
Expected: pass.

---

## Chunk 2: Search and favorites

### Task 3: Real search page

**Files:**
- Modify: `src/pages/SearchPage.tsx`

- [ ] **Step 1: Replace static result array with backend search state**
Track keyword, loading, error, and result list.

- [ ] **Step 2: Query `/species/search` only when the input is non-empty**
Keep hot tags and search history UI as local fallback for now.

- [ ] **Step 3: Render real species cards**
Show Chinese/English names and basic taxonomy/distribution summary using available fields.

- [ ] **Step 4: Navigate using real species context**
At minimum, persist the selected species id for later detail navigation without breaking the current result flow.

- [ ] **Step 5: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

### Task 4: Real favorites list

**Files:**
- Modify: `src/pages/FavoritesPage.tsx`

- [ ] **Step 1: Load real favorites on mount**
Call `/favorites` with page/pageSize.

- [ ] **Step 2: Add loading, empty, and error states**
Keep the current card layout.

- [ ] **Step 3: Render real cover/name/date-ish fallback**
Use `coverImageUrl` when available, otherwise the current fallback image strategy.

- [ ] **Step 4: Wire card click to the species profile or result-compatible flow**
Choose the least disruptive route already available in the app.

- [ ] **Step 5: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

### Task 5: Favorite status and toggle on result page

**Files:**
- Modify: `src/pages/ResultPage.tsx`

- [ ] **Step 1: Load favorite status for the recognized species**
Use `/favorites/{id}/status` once the species id is known.

- [ ] **Step 2: Replace local-only like state with backend toggle**
Use `/favorites/{id}/toggle`.

- [ ] **Step 3: Keep optimistic-feeling UI but fall back safely on request failure**
Show toast on failure and restore state.

- [ ] **Step 4: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

---

## Chunk 3: History standard-complete

### Task 6: Real history list page

**Files:**
- Modify: `src/pages/HistoryPage.tsx`

- [ ] **Step 1: Replace static grouped data with `/recognitions`**
Fetch page 1 of history records.

- [ ] **Step 2: Group records by display date on the client**
Preserve the current grouped visual design.

- [ ] **Step 3: Navigate to detail with `recognitionId`**
Pass id via route state or query param consistently.

- [ ] **Step 4: Add loading, empty, and error states**
Keep the current page shell and search-entry layout.

- [ ] **Step 5: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

### Task 7: Real record detail page

**Files:**
- Modify: `src/pages/RecordDetailPage.tsx`

- [ ] **Step 1: Read `recognitionId` from navigation context**
If missing, show an empty state with a way back to history.

- [ ] **Step 2: Fetch `/recognitions/{id}`**
Render image, species, time, confidence, location, and note from real data.

- [ ] **Step 3: Wire edit navigation with the real record id**
Ensure edit page receives the same identifier.

- [ ] **Step 4: Wire delete action**
Call `DELETE /recognitions/{id}`, then return to history on success.

- [ ] **Step 5: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

### Task 8: Real edit-record page

**Files:**
- Modify: `src/pages/EditRecordPage.tsx`

- [ ] **Step 1: Read the target `recognitionId`**
Use the same navigation contract as detail page.

- [ ] **Step 2: Prefill the form from detail data**
Either via navigation state or by fetching the record if needed.

- [ ] **Step 3: Submit `PATCH /recognitions/{id}`**
Update note and location using the fields the backend supports today.

- [ ] **Step 4: Handle success and failure clearly**
Toast on failure; navigate back to detail on success.

- [ ] **Step 5: Verify manually and with tests/build**
Run: `npm test -- --runInBand && npm run build`
Expected: pass.

---

## Manual verification checklist

- [ ] Search for a known species keyword and confirm real results render
- [ ] Open favorites and confirm real favorited species display
- [ ] From result page, toggle favorite on/off and confirm backend state changes
- [ ] Open history, confirm records load from `/recognitions`
- [ ] Open one history record, confirm real detail values render
- [ ] Edit note/location from the edit page and verify the change persists
- [ ] Delete a history record and verify it disappears from history
- [ ] Run `npm test -- --runInBand`
- [ ] Run `npm run build`

---

Plan complete and saved to `bug-sight-studio/docs/a-search-history-favorites-implementation-plan.md`. Ready to execute.
