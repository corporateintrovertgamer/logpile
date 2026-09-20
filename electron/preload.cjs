const { contextBridge, ipcRenderer, webUtils } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getPathForFile: (file) => {
    try {
      if (webUtils && typeof webUtils.getPathForFile === 'function') {
        return webUtils.getPathForFile(file)
      }
    } catch {}
    return file?.path || ''
  },
  selectCustomArtwork: (gameId) => ipcRenderer.invoke('selectCustomArtwork', gameId),
  clearArtCache: () => ipcRenderer.invoke('clear-art-cache'),
  setGameCategory: (gameId, category) => ipcRenderer.invoke('games:setCategory', gameId, category),
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    reload: () => ipcRenderer.invoke('window:reload'),
  },
  database: {
    getGames: (filters = {}, sort = {}) => ipcRenderer.invoke('db:getGames', filters, sort),
    getLibraryStats: () => ipcRenderer.invoke('db:getLibraryStats'),
    exportCsv: () => ipcRenderer.invoke('db:exportCsv'),
    exportSelectedCsv: (gameIds) => ipcRenderer.invoke('db:exportSelectedCsv', gameIds),
    purgeLibrary: () => ipcRenderer.invoke('db:purgeLibrary'),
    setGameHidden: (gameId, hidden) => ipcRenderer.invoke('db:setGameHidden', gameId, hidden),
    updateGameMetadata: (gameId, fields) => ipcRenderer.invoke('db:updateGameMetadata', gameId, fields),
    deleteGames: (gameIds) => ipcRenderer.invoke('db:deleteGames', gameIds),
    bulkUpdateGames: (gameIds, fields) => ipcRenderer.invoke('db:bulkUpdateGames', gameIds, fields),
    bulkMoveGameCategory: (gameIds, category) => ipcRenderer.invoke('db:bulkMoveGameCategory', gameIds, category),
    bulkSetGameHidden: (gameIds, hidden) => ipcRenderer.invoke('db:bulkSetGameHidden', gameIds, hidden),
    onUpdated: (callback) => {
      if (typeof callback !== 'function') return () => {}
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('library:updated', listener)
      return () => ipcRenderer.removeListener('library:updated', listener)
    },
    seedCheck: () => ipcRenderer.invoke('db:seedCheck'),
    getLibrarySettings: () => ipcRenderer.invoke('db:getLibrarySettings'),
    setLibrarySettings: (settings) => ipcRenderer.invoke('db:setLibrarySettings', settings),
    getActivityLog: (limit = 50) => ipcRenderer.invoke('db:getActivityLog', limit),
    getLibraryHealth: () => ipcRenderer.invoke('db:getLibraryHealth'),
    backupNow: () => ipcRenderer.invoke('db:backupNow'),
    listBackups: () => ipcRenderer.invoke('db:listBackups'),
    openBackupsFolder: (targetPath) => ipcRenderer.invoke('db:openBackupsFolder', targetPath),
    chooseBackupFile: () => ipcRenderer.invoke('db:chooseBackupFile'),
    restoreBackup: (backupPath) => ipcRenderer.invoke('db:restoreBackup', backupPath),
  },
  roulette: {
    pick: () => ipcRenderer.invoke('roulette:pick'),
  },
  scanner: {
    scanAll: () => ipcRenderer.invoke('scanner:scanAll'),
    chooseImportFile: () => ipcRenderer.invoke('scanner:chooseImportFile'),
    importFile: (filePath) => ipcRenderer.invoke('scanner:importFile', filePath),
    importBuffer: (data, filename) => ipcRenderer.invoke('scanner:importBuffer', data, filename),
    onProgress: (callback) => {
      if (typeof callback !== 'function') return () => {}
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('scanner:progress', listener)
      return () => ipcRenderer.removeListener('scanner:progress', listener)
    },
  },
  games: {
    openUri: (uri, launchMeta) => ipcRenderer.invoke('game:openUri', uri, launchMeta),
    logLaunchAttempt: (launchMeta) => ipcRenderer.invoke('game:logAttempt', launchMeta),
    selectCustomArtwork: (gameId) => ipcRenderer.invoke('selectCustomArtwork', gameId),
    changeArtwork: (gameId) => ipcRenderer.invoke('selectCustomArtwork', gameId),
    refetchArtwork: (gameId, exactId, apiKey) => ipcRenderer.invoke('artwork:refetchExact', gameId, exactId, apiKey),
    refetchSelectedArtwork: (gameIds, apiKey) => ipcRenderer.invoke('artwork:refetchSelected', gameIds, apiKey),
    chooseAndSaveArtwork: (gameId, kind) => ipcRenderer.invoke('artwork:chooseAndSave', gameId, kind),
    chooseExecutable: () => ipcRenderer.invoke('game:chooseExecutable'),
    launchExecutable: (executablePath, launchArguments, launchMeta) => ipcRenderer.invoke('game:launchExecutable', executablePath, launchArguments, launchMeta),
  },
  scraper: {
    isSyncing: () => ipcRenderer.invoke('scraper:isSyncing'),
    fetchMissingArt: (apiKey) => ipcRenderer.invoke('scraper:fetchMissingArt', apiKey),
    runBulkArtworkSync: (apiKey) => ipcRenderer.invoke('scraper:runBulkArtworkSync', apiKey),
    syncMetadataAndArt: (apiKey) => ipcRenderer.invoke('scraper:syncMetadataAndArt', apiKey),
    cancelSync: () => ipcRenderer.invoke('scraper:cancelSync'),
    syncMetadata: (apiKey) => ipcRenderer.invoke('scraper:syncMetadata', apiKey),
    generateAutomaticFallbacks: () => ipcRenderer.invoke('scraper:generateAutomaticFallbacks'),
    testIgdb: (clientId, clientSecret) => ipcRenderer.invoke('scraper:testIgdb', clientId, clientSecret),
    fetchGameMetadata: (gameId) => ipcRenderer.invoke('scraper:fetchGameMetadata', gameId),
    chooseOverride: () => ipcRenderer.invoke('artwork:chooseOverride'),
    backupCache: () => ipcRenderer.invoke('artwork:backupCache'),
    restoreCache: () => ipcRenderer.invoke('artwork:restoreCache'),
    clearArtCache: () => ipcRenderer.invoke('clear-art-cache'),
    onUpdated: (callback) => {
      if (typeof callback !== 'function') return () => {}
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('artwork:updated', listener)
      return () => ipcRenderer.removeListener('artwork:updated', listener)
    },
    onProgress: (callback) => {
      if (typeof callback !== 'function') return () => {}
      const listener = (_event, payload) => callback(payload)
      ipcRenderer.on('scraper:progress', listener)
      return () => ipcRenderer.removeListener('scraper:progress', listener)
    },
  },
  system: {
    getSpecs: () => ipcRenderer.invoke('system:getSpecs'),
  },
})
