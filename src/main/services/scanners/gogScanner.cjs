const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { readRegistryValue, fileExists, getDriveLetter, emitProgress, unique, fs } = require('./scannerUtils.cjs')

const REGISTRY_ROOTS = [
  'HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\GOG.com\\Games',
  'HKEY_LOCAL_MACHINE\\SOFTWARE\\GOG.com\\Games',
]

function registrySubkeys(root) {
  try {
    const output = execFileSync('reg.exe', ['query', root], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] })
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.toUpperCase().startsWith('HKEY_LOCAL_MACHINE\\SOFTWARE\\'))
  } catch { return [] }
}

function scanGog(onProgress) {
  const subkeys = unique(REGISTRY_ROOTS.flatMap((root) => registrySubkeys(root)))
  const records = []
  emitProgress(onProgress, { source: 'gog', phase: 'scanning', current: 0, total: subkeys.length, message: subkeys.length ? `Found ${subkeys.length} GOG registry entries.` : 'No GOG registry entries found.' })
  
  subkeys.forEach((key, index) => {
    const gameId = key.split('\\').pop()
    const gameName = readRegistryValue(key, 'gameName')
    const installPath = readRegistryValue(key, 'path')
    const exe = readRegistryValue(key, 'exe')
    
    if (gameName && gameId) {
      const normalizedPath = installPath ? path.normalize(installPath) : null
      records.push({
        canonicalTitle: String(gameName).trim(),
        normalizedTitle: String(gameName).trim(),
        description: null,
        developer: null,
        publisher: null,
        releaseDate: null,
        coverUrl: null,
        heroUrl: null,
        isInstalled: Boolean(normalizedPath),
        driveLetter: getDriveLetter(normalizedPath),
        installPath: normalizedPath,
        installSizeBytes: normalizedPath && fileExists(normalizedPath) ? directorySize(normalizedPath) : 0,
        playTimeSeconds: 0,
        lastPlayed: null,
        platform: 'gog',
        platformGameId: gameId,
        platformLaunchId: gameId,
        idSource: 'gog-registry:game-key',
        launchUri: `goggalaxy://openGameView/${encodeURIComponent(gameId)}`,
        installUri: `goggalaxy://openGameView/${encodeURIComponent(gameId)}`,
        executable: exe || null,
        source: 'local-scan',
        driveStatus: normalizedPath && fileExists(normalizedPath) ? 'online' : 'offline',
      })
    }
    emitProgress(onProgress, { source: 'gog', phase: 'scanning', current: index + 1, total: subkeys.length, message: `Checked ${gameName || gameId}.` })
  })
  return { source: 'gog', records }
}

function directorySize(directory) {
  let total = 0
  const stack = [directory]
  while (stack.length) {
    const current = stack.pop()
    let entries = []
    try { entries = fs.readdirSync(current, { withFileTypes: true }) } catch { continue }
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name)
      if (entry.isDirectory()) stack.push(entryPath)
      else {
        try { total += fs.statSync(entryPath).size } catch { /* Ignore transient files. */ }
      }
    }
  }
  return total
}

module.exports = { scanGog, registrySubkeys, directorySize, REGISTRY_ROOTS }