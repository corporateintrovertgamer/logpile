const os = require('os');
const { execFileSync } = require('child_process');

let cachedSpecs = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60 * 1000

function getSystemSpecs() {
  const now = Date.now()
  if (cachedSpecs && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSpecs
  }

  const rawCpu = os.cpus()[0]?.model?.trim() || 'Unknown CPU'
  const cpu = rawCpu
    .replace(/\(R\)|\(TM\)/gi, '')
    .replace(/@.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()

  const totalRamGb = Math.round(os.totalmem() / (1024 ** 3))
  const freeRamGb = (os.freemem() / (1024 ** 3)).toFixed(1)

  let gpus = []
  try {
    const raw = execFileSync('powershell.exe', ['-NoProfile', '-Command', '(Get-CimInstance Win32_VideoController).Name'], { encoding: 'utf8', timeout: 3500 })
    gpus = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  } catch (e) {
    gpus = ['Graphics Device']
  }

  let gpu = gpus.find(g => /nvidia|geforce|rtx|gtx|radeon|rx\s*\d/i.test(g)) || gpus[0] || 'Unknown GPU'

  let disks = []
  let totalStorageBytes = 0
  let freeStorageBytes = 0
  try {
    const rawDisks = execFileSync('powershell.exe', ['-NoProfile', '-Command', "Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' | ForEach-Object { $_.DeviceID + ',' + $_.FreeSpace + ',' + $_.Size }"], { encoding: 'utf8', timeout: 3500 })
    const lines = rawDisks.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    for (const line of lines) {
      const parts = line.split(',')
      if (parts.length >= 3) {
        const drive = parts[0]
        const free = parseInt(parts[1], 10) || 0
        const size = parseInt(parts[2], 10) || 0
        totalStorageBytes += size
        freeStorageBytes += free
        disks.push({
          drive,
          freeGb: Number((free / (1024 ** 3)).toFixed(1)),
          totalGb: Number((size / (1024 ** 3)).toFixed(1)),
        })
      }
    }
  } catch (e) {}

  const driveLetters = disks.length > 0 ? `${disks[0].drive} to ${disks[disks.length - 1].drive}` : 'All drives'

  cachedSpecs = {
    cpu,
    gpu,
    allGpus: gpus,
    ram: `${totalRamGb} GB RAM`,
    totalRamGb,
    freeRamGb,
    disks,
    driveCount: disks.length,
    driveLetters,
    totalStorageGb: Number((totalStorageBytes / (1024 ** 3)).toFixed(1)),
    freeStorageGb: Number((freeStorageBytes / (1024 ** 3)).toFixed(1)),
    usedStorageGb: Number(((totalStorageBytes - freeStorageBytes) / (1024 ** 3)).toFixed(1)),
  }
  cacheTimestamp = now
  return cachedSpecs
}

module.exports = { getSystemSpecs }
