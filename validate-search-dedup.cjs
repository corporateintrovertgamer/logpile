const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const { app } = require('electron')

const source = fs.readFileSync('./src/App.jsx', 'utf8')
const searchStart = source.indexOf('function normalizeSearchText')
const searchEnd = source.indexOf('function consolidateGames')
const searchModule = `${source.slice(searchStart, searchEnd)}; module.exports = { normalizeSearchText, titleMatchesQuery, titleSearchRank, strictTitleSearch }`
const searchModuleState = { exports: {} }
vm.runInNewContext(searchModule, { module: searchModuleState })
const searchExports = searchModuleState.exports

app.whenReady().then(() => {
  const { createDatabase, getGames } = require('./electron/db.cjs')
  const { mergeRecord } = require('./src/main/services/deduplicationService.cjs')
  const dbPath = path.join(app.getPath('temp'), 'logpile-search-dedup-test.db')
  for (const suffix of ['', '-wal', '-shm']) { try { fs.unlinkSync(`${dbPath}${suffix}`) } catch {} }
  const db = createDatabase(dbPath)
  const record = (title, platform, id, extra = {}) => ({ canonicalTitle: title, platform, platformGameId: id, launchUri: `${platform}://launch/${id}`, installUri: `${platform}://install/${id}`, isInstalled: false, playTimeSeconds: 0, isUtility: false, isDlc: false, ...extra })
  mergeRecord(db, record('Minecraft Legends - Windows', 'custom', 'minecraft-windows'))
  mergeRecord(db, record('Minecraft Legends Xbox Game Studios', 'custom', 'minecraft-xbox'))
  mergeRecord(db, record('A Game - First Response', 'custom', 'first-response'))
  const games = getGames(db, { includeDlc: true }, { field: 'canonical_title', direction: 'asc' })
  const minecraft = games.find((game) => game.canonical_title.includes('Minecraft'))
  const expansion = games.find((game) => game.canonical_title.includes('First Response'))
  const searchGames = [{ canonical_title: 'A Way Out' }, { canonical_title: 'Outlast' }, { canonical_title: 'Mortal Kombat 11' }, { canonical_title: '911 Operator' }, { canonical_title: '911' }]
  const checks = {
    phraseAndMatch: searchExports.strictTitleSearch(searchGames, 'a way out').map((game) => game.canonical_title).join('|') === 'A Way Out',
    numericWholeToken: searchExports.strictTitleSearch(searchGames, '911').every((game) => game.canonical_title === '911 Operator' || game.canonical_title === '911'),
    numericDoesNotMatch11: !searchExports.strictTitleSearch(searchGames, '911').some((game) => game.canonical_title === 'Mortal Kombat 11'),
    exactTitleFirst: searchExports.strictTitleSearch(searchGames, '911')[0]?.canonical_title === '911',
    suffixDedup: games.filter((game) => game.canonical_title.includes('Minecraft')).length === 1,
    suffixSourcesRetained: minecraft?.sources.length === 2,
    firstResponseDlc: expansion?.is_dlc === true,
  }
  console.log(JSON.stringify({ checks }, null, 2))
  db.close()
  for (const suffix of ['', '-wal', '-shm']) { try { fs.unlinkSync(`${dbPath}${suffix}`) } catch {} }
  if (!Object.values(checks).every(Boolean)) process.exitCode = 1
  app.quit()
})
