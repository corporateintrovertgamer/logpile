<img width="1024" height="571" alt="social-preview" src="https://github.com/user-attachments/assets/5eb6f884-294d-4e16-bb28-f05a37eea270" />


# Logpile Desktop — Version 1.0.0

An offline-first, local game library manager designed to organize, catalog, and launch your personal game collection across multiple launchers and standalone directories.

---

## Welcome to Logpile v1.0.0

Logpile is built for gamers who want a clean, unified interface for their entire library without corporate launchers getting in the way. Whether your games come from Steam, Epic Games, GOG, or standalone DRM-free installers, Logpile brings them together in one place with rich artwork and metadata.

### In-App Screenshots

<img width="1919" height="1029" alt="screen-library" src="https://github.com/user-attachments/assets/9104b954-015d-4785-bd03-13dc12480359" />
<img width="1919" height="1027" alt="screen-roulette" src="https://github.com/user-attachments/assets/734066e0-463d-405c-88aa-b2795f44cfcc" />

Dynamic UI themes

<img width="1919" height="1033" alt="GOT - DC - Cinematic theme" src="https://github.com/user-attachments/assets/548a92bf-5e4b-4bcc-8661-6a70ca2d87da" />
<img width="1919" height="1033" alt="MSM-Re - Kinetic theme" src="https://github.com/user-attachments/assets/b339b96b-5759-4b7e-8191-90118afb6127" />
<img width="1919" height="1028" alt="Stray - Playfull theme" src="https://github.com/user-attachments/assets/4b4c456c-ace6-4d77-99b4-fbcaec0b8a93" />
<img width="1920" height="1035" alt="TW3-Re - Atmospheric theme (Large)" src="https://github.com/user-attachments/assets/8cf21124-ea71-409a-ad0b-5f743d428b97" />
<img width="1919" height="1031" alt="Valorant - Competetive theme" src="https://github.com/user-attachments/assets/162c30a0-971d-47b7-a883-2752424b61cb" />

Game roulette
[roulette-demo.webm](https://github.com/user-attachments/assets/a3610ff5-2637-41a3-a1ab-769caaf4997c)


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

---

## Known Limitations

- Windows only.
- The installer is unsigned, so Windows SmartScreen shows a warning (see Installation).
- Your SteamGridDB and IGDB keys are stored as plain text in the local database. Do not share your database or backup files.
- Logpile currently runs on Electron 32, which no longer receives security updates. An upgrade is planned for version 1.2.0.

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
