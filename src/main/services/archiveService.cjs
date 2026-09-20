const fs = require('node:fs')
const path = require('node:path')
const AdmZip = require('adm-zip')
const archiver = require('archiver')

function artworkCacheDir(userDataPath) {
  if (typeof userDataPath !== 'string' || !path.isAbsolute(userDataPath)) throw new Error('Invalid application data path.')
  return path.join(userDataPath, 'artwork_database')
}
function artworkCacheDirs(userDataPath) {
  return [
    path.join(userDataPath, 'artwork_database'),
    path.join(userDataPath, 'artwork'),
    path.join(userDataPath, 'art_cache'),
  ]
}

function listFiles(root) {
  if (!fs.existsSync(root)) return []
  const result = []
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name)
    if (entry.isDirectory()) result.push(...listFiles(fullPath))
    else if (entry.isFile()) result.push(fullPath)
  }
  return result
}

async function backupArtworkCache(userDataPath, destinationPath) {
  if (typeof destinationPath !== 'string' || !path.isAbsolute(destinationPath) || path.extname(destinationPath).toLowerCase() !== '.zip') throw new Error('Invalid artwork backup destination.')
  const cacheDirs = artworkCacheDirs(userDataPath).filter((cacheDir) => fs.existsSync(cacheDir) && fs.statSync(cacheDir).isDirectory())
  const files = cacheDirs.reduce((total, cacheDir) => total + listFiles(cacheDir).length, 0)
  const temporaryPath = `${destinationPath}.partial`
  await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true })
  await fs.promises.rm(temporaryPath, { force: true })
  return new Promise((resolve, reject) => {
    let settled = false
    const output = fs.createWriteStream(temporaryPath)
    const archive = archiver('zip', { zlib: { level: 6 } })
    const fail = (error) => {
      if (settled) return
      settled = true
      output.destroy()
      archive.destroy()
      fs.promises.rm(temporaryPath, { force: true }).catch(() => {}).finally(() => reject(error instanceof Error ? error : new Error(String(error))))
    }
    output.on('error', fail)
    archive.on('error', fail)
    archive.on('warning', (warning) => { if (warning?.code !== 'ENOENT') fail(warning) })
    output.on('close', async () => {
      if (settled) return
      try {
        await fs.promises.rm(destinationPath, { force: true })
        await fs.promises.rename(temporaryPath, destinationPath)
        settled = true
        resolve({ savedPath: destinationPath, files })
      } catch (error) { fail(error) }
    })
    archive.pipe(output)
    try {
      for (const cacheDir of cacheDirs) archive.directory(cacheDir, path.basename(cacheDir))
      const finalized = archive.finalize()
      if (finalized?.catch) finalized.catch(fail)
    } catch (error) { fail(error) }
  })
}

function safeEntryPath(cacheDir, relative) {
  const cleanName = String(relative || '').replace(/\\/g, '/').replace(/^\/+/, '')
  if (!cleanName || cleanName.split('/').includes('..')) throw new Error('The artwork archive contains an unsafe path.')
  const root = path.resolve(cacheDir)
  const destination = path.resolve(root, cleanName)
  if (destination !== root && !destination.startsWith(`${root}${path.sep}`)) throw new Error('The artwork archive contains an unsafe path.')
  return destination
}

function restoreArtworkCache(userDataPath, archivePath) {
  if (typeof archivePath !== 'string' || !path.isAbsolute(archivePath) || path.extname(archivePath).toLowerCase() !== '.zip') throw new Error('Choose a .zip artwork backup.')
  if (!fs.existsSync(archivePath) || !fs.statSync(archivePath).isFile()) throw new Error('The selected artwork backup could not be found.')
  if (fs.statSync(archivePath).size > 1024 * 1024 * 1024) throw new Error('The artwork backup is too large to restore safely.')
  const cacheDir = artworkCacheDir(userDataPath)
  fs.mkdirSync(cacheDir, { recursive: true })
  const zip = new AdmZip(archivePath)
  let files = 0
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue
    const cleanName = String(entry.entryName || '').replace(/\\/g, '/').replace(/^\/+/, '')
    const match = cleanName.match(/^(artwork_database|art_cache|artwork)\/(.+)$/i)
    const targetRoot = cacheDir
    const relative = match ? match[2] : cleanName
    const destination = safeEntryPath(targetRoot, relative)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, entry.getData())
    files += 1
  }
  return { archivePath, files, cacheDir }
}

module.exports = { artworkCacheDir, backupArtworkCache, restoreArtworkCache }
