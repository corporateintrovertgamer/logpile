# Logpile — Agent Context

Read this entire file before doing anything else. Follow the Standing Rules for the whole session. Then look at the Current Task and Session Log to see exactly where work left off, and confirm with the user what step you're starting before touching anything.

---

## Project Overview

**Logpile** (formerly CIGL / Aegis Launcher) — an offline-first Electron desktop app for managing a local game library of 1,500+ games.

**Stack:**
- Electron main process: Node.js + better-sqlite3 (backend/database)
- Frontend: React 18 + Vite (dev server on port 5178) + Tailwind CSS + TanStack Virtual (virtualized game grid)
- Local SQLite database (`logpile.db`)
- SteamGridDB API integration for artwork fetching/caching (`artwork_cache`)
- Custom `local-file://` privileged protocol for local file access (registered via `protocol.registerSchemesAsPrivileged` + `net.fetch` in `electron/main.cjs`)
- Unifies Steam/Epic/GOG/manual DRM-free sources, with local playtime logging

**Working source tree:** rebuilding forward from the `source_code.zip` backup (the original, more robust v0.9.5 codebase), NOT from the OpenCode/Nemotron rebuild attempt (which was abandoned).

---

## Standing Rules (non-negotiable, every session)

1. **Read-only by default.** You may read any file freely. Do **NOT** edit, write, or delete any file without explicit approval for that *specific* change, given in that session.
2. **Build passing ≠ correct.** A passing typecheck/lint/build is only a minimum bar. Database or IPC changes require verified functional testing, not just a clean build.
3. **Offline-first.** No external CDNs, no web-dependent runtime assets in the shipped app.
4. **Don't guess — ask.** If context is missing or ambiguous, ask the user directly rather than searching the repo blind or assuming.
5. **Work one step at a time.** Propose or take one discrete step, then stop and confirm with the user before moving to the next step.
6. **Update this file before ending a session** — see Session Log below.

---

## Current Phase

**Phase 3** (in progress): fixing the artwork pipeline and other post-rebuild regressions.

Phase 0 (environment/stability) and Phase 2 (rebrand/visual overhaul) are complete.

---

## Current Task: Artwork Bug

Artwork is missing or broken for **24+ games** in the rebuilt app. This is a **regression** — artwork display worked correctly in the previous build — and it is **systemic**, not isolated to any single game.

**Files to check first:**
- `electron/db.cjs`
- `src/utils/artworkUrl.js`
- The SteamGridDB fetch/caching logic (search for `artwork_cache` if filename is unclear)

**Suspected areas:**
- Path resolution against the `local-file://` protocol
- The fetch/caching pipeline itself
- Key mismatches between what's fetched and what's queried in SQLite

**Goal for this task:** diagnose root cause, propose a fix, get approval, then implement — one step at a time, confirming after each.

---

## Open Issue #2: GOG & Repack Source Scanners Appear Fully Broken

Confirmed by comparing the user's actual installed-games list against Logpile's detection export (CSV diff, verified line-by-line, not guessed):

**GOG source: 0/5 detected**
- The Witcher 2
- Prince of Persia
- Prince of Persia: The Sands of Time
- Prince of Persia: Warrior Within
- Prince of Persia T2T

**Repack source: 0/4 detected**
- ELDEN RING
- Sekiro: Shadows Die Twice
- The Blood of Dawnwalker
- Resonance: A Plague Tale Legacy

**3 individual Epic/Steam titles also not detected (likely separate, per-title bugs, not a source-wide failure):**
- Jedi Survivor (Epic)
- Assassin's Creed Mirage (Epic)
- Detroit Become Human (Steam)

**Conclusion (not yet verified in code, just inferred from the data):** 100% miss rate on two entire sources strongly suggests the GOG scanner and the Repack scanner are either not implemented, not being invoked at all, or failing silently/early — this is very different from a per-game matching bug. The 3 Epic/Steam stragglers are probably unrelated individual issues (e.g. install path detection, folder-name parsing) and should be investigated separately from the GOG/Repack source-wide failure.

**Not yet done:** No code has been read or changed for this issue yet. Next step is to locate and read the GOG scanner and Repack scanner modules (likely in `electron/` alongside the Steam/Epic scanners) and check whether they're being called at all during a library scan.

**Ruled out / corrected during investigation (do not re-flag these):**
- "Kelvin" was initially flagged missing — it is NOT missing, it's the folder/internal name for "Fahrenheit: Indigo Prophecy Remastered", which Logpile does detect correctly (Steam).
- HITMAN 3, Marvel's Spider-Man Remastered, and BEYOND Two Souls were initially flagged as source-mismatched (Epic vs Steam) — user corrected the source list, these are actually owned on Steam and Logpile has them correctly tagged. No bug here.
- Many other apparent "missing" titles from a naive title diff (e.g. `BehindTheFrame` vs `Behind the Frame: The Finest Scenery`) were false positives from folder-name vs display-name differences, not real detection gaps.

---

## Other Known Open Items (not current focus, for awareness only)

- SteamGridDB API key field not persisting/saving in local SQLite
- "Show Missing Artwork" / "Show Missing IDs" filters work on All Games tab but return zero results on other tabs (Installed/Ready to Install/DLC)
- "Select All Filtered" grid control not yet built
- Wants persistent activity log (SQLite table) + two sidebar widgets: library health mini-card (status, last backup, backup-now button) and recent-activity feed
- Editing/updating a record resets game list scroll position to top
- Ubisoft and GOG game launches not working; EA launches work; EA and Steam show an "ID error"
- npm audit: 20 vulnerabilities (3 moderate, 16 high, 1 critical) from Playwright/Vitest install — not yet resolved

---

## Session Log

Add a new dated entry at the end of every session or handoff. Keep entries short: what you did, current state, what's next.

### 2026-09-11
- Session ended with a fresh agent losing task context after an interruption (no persisted state existed at the time).
- This file was created to fix that. No code changes have been made yet this session.
- Separately (outside the coding agent, in a planning/analysis chat with Claude), user uploaded actual-installed-games list vs Logpile's detection export CSV. Diffed and verified — see "Open Issue #2" above for full results.
- No code has been touched for either open issue yet. Both are diagnosis-only so far.
- **Next step (either issue):** Read `electron/db.cjs`, `src/utils/artworkUrl.js`, and the artwork_cache fetch logic for Issue #1 (artwork). For Issue #2, locate and read the GOG and Repack scanner modules to check if they're being invoked during a scan. Report findings for whichever is tackled first. Do not apply any fix until approved.
- User is preparing a backup handoff to Gemini Pro (separate `HANDOFF.md`) in case of a Claude session limit, so work can continue uninterrupted and resume with Claude later. Gemini's role stays the same as before: drafting prompts for the coding agent, not writing code directly.

### 2026-09-17
- **Issue #1 (Artwork Bug & SteamGridDB Pipeline) — FIXED:**
  - Diagnosed regression where `fetchSteamStorePoster` blindly saved 404 Steam CDN URLs. Patched `fetchSteamStorePoster` with HTTP `HEAD` verification.
  - Ran SQLite database migration fixing 17 broken 404 URLs to `NULL`, reducing missing artwork count significantly.
  - Fixed `.exe` icon extraction: database column was `executable_path` while artworkService was querying `game.executable`. Added `resolveGameExecutable` helper supporting both `executable_path` and searching `install_path`.
  - Fixed SteamGridDB ID matching: `refetchSelectedArtwork` and `runBulkArtworkSync` previously ignored manually entered `steamgriddb_id` and searched by title. Updated to prioritize `steamgriddb_id` first.
  - Enhanced `refetchArtworkByExactId`: supports both SteamGridDB Game ID (`/grids/game/:id`), Steam App ID (`/grids/steam/:id`), fallback to any aspect ratio if 600x900 is missing, official Steam Store CDN fallback, and hero banner downloading to `art_cache`.
  - Fixed `updateGameMetadata` in `electron/db.cjs`: prevented wiping `cover_url` to `NULL` when `steamgriddb_id` was modified.
  - Synced `matchId` and `steamGridDbId` in `GameEditorModal`, pre-filled API key from settings, and automatically persisted any newly entered API key.
- **Issue #1 & Artwork/Hero Pipeline Resolution — COMPLETED & VERIFIED:**
  - **Cover Artwork & Hero Banner Local Caching:**
    - Upgraded `runBulkArtworkSync` and `refetchSelectedArtwork` in `artworkService.cjs` to query for games missing `cover_url` OR `hero_url`.
    - Integrated `fetchHeroesForId` from SteamGridDB (`/heroes/game/:id`) and official Steam hero CDN fallback (`library_hero.jpg`).
    - Successfully downloaded and cached both `-cover.jpg` and `-hero.jpg` locally in `C:\Users\rites\AppData\Roaming\logpile\art_cache/` for all non-Steam/Epic/GOG/Repack games (*Mortal Shell*, *Resident Evil Requiem*, *The Witcher 3*, all 4 *Prince of Persia* titles, *Resonance: A Plague Tale Legacy*, and *The Blood of Dawnwalker*).
  - **Utility App (`Wand`) & Executable Icon Extraction Fallback:**
    - Diagnosed missing artwork for utility app `Wand` (`C:\Program Files\Epic Games\Wand`).
    - Upgraded `resolveGameExecutable` to recursively search `install_path` up to 2 directories deep for `.exe` files (skipping uninstallers/crash/setup/redist).
    - Extracted executable icon from `WandLaunch.exe` to `art_cache/wand-icon.png` via PowerShell `[System.Drawing.Icon]::ExtractAssociatedIcon`.
    - Automatically updated `executable_path` and `cover_url` in SQLite.
  - **Game Metadata Editor (`GameEditorModal`):**
    - Added live cover and hero banner previews inside the modal so users immediately see loaded artwork.
    - Added non-blocking refetch feedback ("Artwork and hero banner fetched and saved locally!") without force-closing the modal.
    - Added auto-refetch on "Save changes": if `steamGridDbId` was changed or game lacks artwork, saving automatically fetches cover and hero before saving metadata.
  - **Renderer (`HeroView` & Image Error Recovery):**
    - Fixed CSS `--hero-image` and `--hero-cover` variables in `HeroView` to pass URLs through `normalizeArtworkUrl`, enabling local `local-file:///...` art assets to load properly in Chromium.
    - Updated `handleArtworkChanged`, `handleEditorSaved`, `handleRefetchSelected`, and `loadData` to clear `failedImageIds` when valid artwork is saved or reloaded, resolving stale missing-artwork filters.
  - **Verification:**
    - Entire library (97 titles): **0 missing covers**!
    - 23 offline assets generated in `art_cache`.
    - Frontend re-bundled with `npm run build` with 0 errors (built in 2.37s).

