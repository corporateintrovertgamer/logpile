========================================================================
LOGPILE DESKTOP - VERSION 1.0.0
An offline-first, local game library manager
========================================================================

Welcome to Logpile Desktop v1.0.0!

Logpile is a fast, lightweight, and offline-first personal game launcher
and collection organizer. It scans your local drives for games installed 
via Steam, Epic Games Store, and GOG, bringing them together under a 
single, distraction-free interface.


------------------------------------------------------------------------
INSTALLATION
------------------------------------------------------------------------
1. Run "Logpile Setup 1.0.0.exe" to begin installation.

2. Windows SmartScreen Notice:
   Note: Because Logpile is an unsigned open-source application, Windows 
   SmartScreen may flag the installer. Click "More info" and then 
   "Run anyway" to proceed.

3. Custom Installation Directory:
   During setup, you can select any destination directory on your system.
   We strongly recommend installing to a custom folder on your preferred
   drive (for example, D:\Logpile or D:\Games\Logpile).
   
   Logpile uses a self-contained portable data structure ("logpile_data") 
   located directly alongside the application executable. All game metadata, 
   artwork caches, SQLite databases, and backups are stored inside this 
   folder, completely preventing bloat in your C: drive AppData folder.


------------------------------------------------------------------------
API SETUP (ARTWORK & METADATA)
------------------------------------------------------------------------
To automatically fetch official vertical covers, banners, and game details,
you can add your personal API keys inside the Settings panel:

1. SteamGridDB (Box Art, Banners & Logos):
   - Register at https://www.steamgriddb.com
   - Navigate to Preferences -> API
   - Generate your personal API Key and paste it into Logpile Settings.

2. IGDB (Descriptions, Release Dates & Genres):
   - Log into https://dev.twitch.tv/console
   - Register an application (Category: Application Integration, 
     Redirect: http://localhost)
   - Copy Client ID & Client Secret into Logpile Settings.



------------------------------------------------------------------------
SUPPORT THE DEVELOPER
------------------------------------------------------------------------
Logpile is 100% free, private, and open source with no telemetry.
If it helps you organize your collection, consider supporting development:

- Ko-fi: https://ko-fi.com/corporateintrovertgamer
- Buy Me a Coffee: https://buymeacoffee.com/Corporateintrovertgamer
- GitHub Sponsors: https://github.com/corporateintrovertgamer

Crypto Donations:
- BTC:  bc1qcf9f3fd5q5n9gxkjz5fh74qgdv2dgryqkkdmlk
- ETH:  0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0
- USDT: 0xE3e9e4Dfb4c87B6101700c70F73790a903f92Ef0
- SOL:  F8aPJG3tUtbLHbhdfxeNFmcv8b2GK7anY3EmTr6CcHkS


------------------------------------------------------------------------
LICENSE
------------------------------------------------------------------------
Licensed under the MIT License.
Copyright (c) 2026 Corporate Introvert Gamer (Ritesh Soni)
========================================================================
