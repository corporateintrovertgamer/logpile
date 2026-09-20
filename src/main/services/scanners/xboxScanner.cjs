const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { fileExists, safeRead, getDriveLetter, emitProgress } = require('./scannerUtils.cjs')
const { directorySize } = require('./gogScanner.cjs')

function scanXbox(onProgress) {
  const records = []
  emitProgress(onProgress, { source: 'xbox', phase: 'scanning', current: 0, total: 1, message: 'Scanning for Xbox games...' })

  try {
    // 1. Check known .GamingRoot drives and Xbox default directories
    const drives = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'K']
    const xboxFolders = []

    for (const d of drives) {
      const driveRoot = `${d}:\\`
      const gamingRootMarker = path.join(driveRoot, '.GamingRoot')
      const xboxDefault = path.join(driveRoot, 'XboxGames')

      if (fileExists(gamingRootMarker)) {
        const markerContent = safeRead(gamingRootMarker) || ''
        const lines = markerContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
        lines.forEach(folder => {
          const resolved = path.join(driveRoot, folder)
          if (fileExists(resolved)) xboxFolders.push(resolved)
        })
      }
      if (fileExists(xboxDefault) && !xboxFolders.includes(xboxDefault)) {
        xboxFolders.push(xboxDefault)
      }
    }

    // Scan subdirectories in verified Xbox library folders
    const { fs } = require('./scannerUtils.cjs')
    for (const rootFolder of xboxFolders) {
      try {
        const subdirs = fs.readdirSync(rootFolder, { withFileTypes: true })
        for (const dirent of subdirs) {
          if (!dirent.isDirectory()) continue
          const gamePath = path.join(rootFolder, dirent.name)
          const contentFolder = path.join(gamePath, 'Content')
          const targetDir = fileExists(contentFolder) ? contentFolder : gamePath

          // Check for appxmanifest or microsoft game configuration
          const hasAppx = fileExists(path.join(targetDir, 'AppxManifest.xml'))
          const hasConfig = fileExists(path.join(targetDir, 'MicrosoftGame.config'))

          if (hasAppx || hasConfig) {
            const title = dirent.name.replace(/[._-]/g, ' ').trim()
            records.push({
              canonicalTitle: title,
              normalizedTitle: title,
              description: null,
              developer: null,
              publisher: 'Xbox Game Studios',
              releaseDate: null,
              coverUrl: null,
              heroUrl: null,
              isInstalled: true,
              driveLetter: getDriveLetter(gamePath),
              installPath: gamePath,
              installSizeBytes: directorySize(gamePath),
              playTimeSeconds: 0,
              lastPlayed: null,
              platform: 'xbox',
              platformGameId: `xbox:${dirent.name}`,
              platformLaunchId: `xbox:${dirent.name}`,
              idSource: 'xbox:gaming-root',
              launchUri: null,
              installUri: null,
              executable: null,
              source: 'local-scan',
              driveStatus: 'online',
            })
          }
        }
      } catch { /* Folder unreadable or locked */ }
    }

    // 2. Query AppxPackages that have actual Gaming capabilities
    const psScript = `
      Get-AppxPackage | Where-Object { 
        $_.InstallLocation -and 
        ($_.InstallLocation -match 'XboxGames' -or (Test-Path (Join-Path $_.InstallLocation 'MicrosoftGame.config')))
      } | Select-Object Name, PackageFamilyName, InstallLocation | ConvertTo-Json -Compress
    `
    const output = execFileSync('powershell.exe', ['-NoProfile', '-Command', psScript], {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore'],
    })

    if (output && output.trim()) {
      const parsed = JSON.parse(output)
      const apps = Array.isArray(parsed) ? parsed : [parsed]

      apps.forEach((app) => {
        const installLocation = app.InstallLocation ? path.normalize(app.InstallLocation) : null
        if (!installLocation) return
        const isAlreadyAdded = records.some(r => r.installPath && r.installPath.toLowerCase() === installLocation.toLowerCase())
        if (isAlreadyAdded) return

        const title = (app.Name || '').replace(/^.*?_/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[._-]/g, ' ').trim()
        records.push({
          canonicalTitle: title,
          normalizedTitle: title,
          description: null,
          developer: null,
          publisher: 'Xbox Game Studios',
          releaseDate: null,
          coverUrl: null,
          heroUrl: null,
          isInstalled: fileExists(installLocation),
          driveLetter: getDriveLetter(installLocation),
          installPath: installLocation,
          installSizeBytes: fileExists(installLocation) ? directorySize(installLocation) : 0,
          playTimeSeconds: 0,
          lastPlayed: null,
          platform: 'xbox',
          platformGameId: app.PackageFamilyName,
          platformLaunchId: app.PackageFamilyName,
          idSource: 'xbox:appx-package',
          launchUri: `shell:AppsFolder\\${app.PackageFamilyName}!App`,
          installUri: null,
          executable: null,
          source: 'local-scan',
          driveStatus: fileExists(installLocation) ? 'online' : 'offline',
        })
      })
    }
  } catch (error) {
    // Fail silently without breaking scanAll
  }

  emitProgress(onProgress, { source: 'xbox', phase: 'complete', current: 1, total: 1, message: `Found ${records.length} Xbox titles.` })
  return { source: 'xbox', records }
}

module.exports = { scanXbox }