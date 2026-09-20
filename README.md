<img width="1146" height="640" alt="Large banner for app" src="https://github.com/user-attachments/assets/b352518f-7f4a-4686-b213-8b2b35b36fa4" />




# Logpile Desktop — Version 1.0.0

An offline-first, local game library manager designed to organize, catalog, and launch your personal game collection across multiple launchers and standalone directories.

---

## Welcome to Logpile v1.0.0

Logpile is built for gamers who want a clean, unified interface for their entire library without corporate launchers getting in the way. Whether your games come from Steam, Epic Games, GOG, or standalone DRM-free installers, Logpile brings them together in one place with rich artwork and metadata.

## 📸 Gallery

### Unified Library View
Bring your Steam, Epic, and GOG libraries together in one clean, distraction-free grid. 
<img width="1024" height="550" alt="Library installed page" src="https://github.com/user-attachments/assets/6357369f-d533-44d3-87ce-138af1d82aa6" />


### Cinematic Game Details
Rich metadata, beautiful widescreen backdrops, and seamless launching directly from the app
<img width="1024" height="550" alt="RDR 2" src="https://github.com/user-attachments/assets/c00f0f72-f0db-4781-94fa-551053df8218" />
<img width="1024" height="550" alt="Star wars Jedi" src="https://github.com/user-attachments/assets/3a1722ad-b6ab-4a49-969a-f06dd682404d" />


### Intelligent Discovery
Find what to play next with built-in genre and franchise recommendations.
<img width="1920" height="1032" alt="Same frenchise or series" src="https://github.com/user-attachments/assets/79af5db0-1371-4479-871c-6c37656c489a" />
<img width="1920" height="1032" alt="Realted genre recommendations" src="https://github.com/user-attachments/assets/10e9ceeb-c710-42ba-98fb-3b0fe8a5cae5" />


### Today's Pick
Can't decide? Let the local roulette wheel pick a random game from your backlog.
<img width="1920" height="1032" alt="Todays pick result" src="https://github.com/user-attachments/assets/72bfe8c7-c6e9-4bd7-a6db-5d6e56b6386b" />
<img width="1024" height="550" alt="Todays pick" src="https://github.com/user-attachments/assets/5e5748ba-9b44-4241-b259-1e2d72a0faea" />

---

### Key Features

- **Offline-First & Private**: All data is stored locally in an embedded SQLite database. No telemetry, no background tracking, and no account required to use it (free API keys are optional, for extra artwork and metadata). The app only goes online to fetch artwork and metadata from SteamGridDB, IGDB, and Steam's image servers.
- **Auto-Detection & Scanning**: Automatically locates installed games across Steam, Epic Games Store, and GOG libraries on all connected drives.
- **High-Resolution Artwork & Metadata**: Fetches official vertical box art, heroes, logos, and game details via SteamGridDB and IGDB.
- **Portable Data Architecture (`logpile_data`)**: Stores all database files, backups, logs, and artwork caches directly in a self-contained folder next to the application executable, keeping your primary C: drive free of AppData bloat.
- **Custom Categorization & Status**: Filter by genres, backlog status, utility tools, DLCs, and hidden entries.
- **Today's Pick**: Built-in roulette wheel to pick a random installed game from your backlog when you can't decide what to play.

---

## Installation

1. Download the latest installer: `Logpile.Setup.1.0.0.exe`.
2. Run the installer and follow the setup wizard.
3. **Important Security Notice**:
   > *Note: Because Logpile is an unsigned open-source application, Windows SmartScreen may flag the installer. Click "More info" and then "Run anyway" to proceed.*
4. **Choose a Custom Folder**:
   During installation, we recommend selecting a custom folder on your preferred drive (e.g., `D:\Logpile` or `D:\Games\Logpile`). Logpile uses a portable data architecture where your database, logs, and image caches are kept in a local `logpile_data` folder alongside the executable to prevent C: drive AppData bloat.

### Updating & Uninstalling

- **Updating**: Download the newest installer from the Releases page, run it, and choose the same install folder. Your data in the `logpile_data` folder is kept.
- **Uninstalling**: When you uninstall, Logpile asks whether to keep or delete your data. Choose No to keep it for a future reinstall.

---

## API Setup (Artwork & Metadata)

To populate game covers, backgrounds, and metadata, Logpile allows you to connect your own free personal API keys in the **Settings** panel:

### 1. SteamGridDB (High-Res Covers, Heroes & Logos)
1. Create a free account at [steamgriddb.com](https://www.steamgriddb.com).
2. Go to your profile &rarr; **Preferences** &rarr; **API**.
3. Click **Generate API Key**, copy it, and paste it into Logpile's **Settings**.

### 2. IGDB (Game Summaries, Genres & Release Dates)
1. Log into the [Twitch Developer Console](https://dev.twitch.tv/console) with your Twitch account.
2. Under **Applications**, click **Register Your Application**.
3. Set Name to `Logpile`, Category to `Application Integration`, and OAuth Redirect URL to `http://localhost`.
4. Copy your **Client ID** and generate a **Client Secret**, then paste both into Logpile's **Settings**.

---

## Support the Developer

Logpile is completely free and open-source software developed by independent developer **Corporate Introvert Gamer (Ritesh Soni)**. If Logpile helps you manage your game collection, consider supporting future development:

- **Ko-fi**: [ko-fi.com/corporateintrovertgamer](https://ko-fi.com/corporateintrovertgamer)
- **Buy Me a Coffee**: [buymeacoffee.com/Corporateintrovertgamer](https://buymeacoffee.com/Corporateintrovertgamer)
- **GitHub**: [github.com/corporateintrovertgamer](https://github.com/corporateintrovertgamer)

### Crypto Donations
- **BTC**: `bc1qcf9f3fd5q5n9gxkjz5fh74qgdv2dgryqkkdmlk`
- **ETH**: `0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0`
- **USDT (ERC-20)**: `0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0`
- **SOL**: `F8aPJG3tUtbLHbhdfxeNFmcv8b2GK7anY3EmTr6CcHkS`

---

## Known Limitations

- Windows only.
- The installer is unsigned, so Windows SmartScreen shows a warning (see Installation).
- Your SteamGridDB and IGDB keys are stored as plain text in the local database. Do not share your database or backup files.
- Logpile currently runs on Electron 32, which no longer receives security updates. An upgrade is planned for version 1.0.1.

---

## Credits and Trademarks

Artwork provided by [SteamGridDB](https://www.steamgriddb.com). Game data provided by [IGDB](https://www.igdb.com).

All game titles, storefront names, and logos are trademarks or registered trademarks of their respective owners. Logpile is an independent open-source project and is not affiliated with, sponsored by, or endorsed by Valve, Epic Games, CD Projekt, Electronic Arts, or Ubisoft.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2026 Corporate Introvert Gamer (Ritesh Soni)
```
