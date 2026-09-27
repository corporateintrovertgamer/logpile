let cachedToken = null
let cachedClientId = null
let tokenExpiresAt = 0

async function getIgdbToken(clientId, clientSecret) {
  const cleanId = String(clientId || '').trim()
  const cleanSecret = String(clientSecret || '').trim()
  if (!cleanId || !cleanSecret) return null

  const now = Date.now()
  if (cachedToken && cachedClientId === cleanId && tokenExpiresAt > now + 60000) {
    return cachedToken
  }

  try {
    const bodyParams = new URLSearchParams({
      client_id: cleanId,
      client_secret: cleanSecret,
      grant_type: 'client_credentials',
    })
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => null)
      console.warn('[IGDB] OAuth token request failed with status:', res.status, errData?.message || '')
      return null
    }
    const data = await res.json()
    if (data?.access_token) {
      cachedToken = data.access_token
      cachedClientId = cleanId
      tokenExpiresAt = now + ((data.expires_in || 3600) * 1000)
      return cachedToken
    }
  } catch (err) {
    console.warn('[IGDB] OAuth token error:', err.message)
  }
  return null
}

async function testIgdbConnection(clientId, clientSecret) {
  const cleanId = String(clientId || '').trim()
  const cleanSecret = String(clientSecret || '').trim()
  if (!cleanId) return { success: false, error: 'IGDB Client ID is required.' }
  if (!cleanSecret) return { success: false, error: 'IGDB Client Secret is required.' }

  try {
    const bodyParams = new URLSearchParams({
      client_id: cleanId,
      client_secret: cleanSecret,
      grant_type: 'client_credentials',
    })
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyParams.toString(),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return {
        success: false,
        error: data?.message ? `Twitch OAuth: ${data.message}` : `HTTP Error ${res.status}`,
      }
    }
    if (data?.access_token) {
      return { success: true, message: 'Authentication successful! Connected to IGDB.' }
    }
    return { success: false, error: 'No access token received from Twitch.' }
  } catch (err) {
    return { success: false, error: err.message || 'Connection failed.' }
  }
}

function cleanTitleForSearch(rawTitle) {
  if (!rawTitle) return ''
  return String(rawTitle)
    .replace(/\s*[\(\[](?:steam|epic|gog|ea|ubisoft|repack|edition|definitive|remastered|goty)[\)\]]/gi, '')
    .replace(/[^\w\s:.'\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripTitleNoise(title) {
  if (!title) return ''
  const str = String(title || '').trim()

  // Special known DLC / expansion mappings
  const low = str.toLowerCase()
  if (low.includes('dark justiciar shadowheart party pack')) return "Baldur's Gate 3"
  if (low.includes('daggerfall unity')) return "The Elder Scrolls II: Daggerfall"

  let cleaned = str
    .replace(/\s*\((?:tm|r|c)\)/gi, '')
    .replace(/[™®©]/g, '')
    .replace(/\b(?:Single\s*Player|Multiplayer|Singleplayer)\b/gi, ' ')
    .replace(/\b(?:PTS|Public\s+Test\s+Server)\b/gi, ' ')
    .replace(/\b(?:Starter\s+Access)\b/gi, ' ')
    .replace(/\b(?:Xbox\s+Game\s+Studios)\b/gi, ' ')
    .replace(/\b(?:GOG\s+Cut)\b/gi, ' ')
    .replace(/\b(?:Deluxe\s+Edition\s+Upgrade(?:\s+Bundle)?|Upgrade\s+Bundle|Upgrade)\b/gi, ' ')
    .replace(/\b(?:Franchise\s+Bundle|\d+th\s+Anniversary\s+Bundle|Starter\s+Bundle(?:\s*\d+)?|The\s+Daring\s+Lifestyle\s+Bundle|Seasoning'?s\s+Greetings\s+Bundle|Thanatoasty\s+Bundle)\b/gi, ' ')
    .replace(/\b(?:Free\s+Welcome\s+Gift|Decal\s+Pack|Triple\s+Decal\s+Pack|Starter\s+Pack|Founder'?s\s+Pack|Party\s+Pack|Mega\s+Pack|Extras\s+Pack)\b/gi, ' ')
    .replace(/\b(?:Creator\s+Kit|Giveaway|Mega\s+Giveaway|Mega\s+Sale\s+Bundle)\b/gi, ' ')
    .replace(/\b(?<!Hogwarts\s)Legacy\b/gi, ' ')
    .replace(/\b(?:Demo|Prologue|Playtest|Beta|Alpha|ModKit|Standalone|Dedicated Server|Benchmark)\b/gi, ' ')
    .replace(/\b(?:DLC|Bundle|Edition|Definitive|Remastered|Goty|Enhanced|Pack)\b/gi, ' ')
    .replace(/\s*\([^)]*\)/g, ' ')
    .replace(/\s*\[[^\]]*\]/g, ' ')
    .replace(/\s*[-–—:]+\s*$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned
}

function getTitleVariations(rawTitle) {
  const variations = []
  const base = cleanTitleForSearch(rawTitle)
  if (base) variations.push(base)

  const stripped = stripTitleNoise(rawTitle)
  if (stripped && stripped.toLowerCase() !== base.toLowerCase() && !variations.includes(stripped)) {
    variations.push(stripped)
  }

  if (rawTitle.includes(' -- ') || rawTitle.includes(' - ') || rawTitle.includes(':') || rawTitle.includes('—')) {
    const prefix = cleanTitleForSearch(rawTitle.split(/[:–—]| - | -- /)[0])
    if (prefix && prefix.length >= 2 && !variations.some((v) => v.toLowerCase() === prefix.toLowerCase())) {
      variations.push(prefix)
    }
  }

  return variations
}

function parseIgdbGameRecord(best) {
  if (!best) return null
  const synopsis = (best.summary || best.storyline || '').trim()
  const genres = Array.isArray(best.genres)
    ? best.genres.map((g) => g.name).filter(Boolean).join(', ')
    : ''

  const devs = []
  const pubs = []
  if (Array.isArray(best.involved_companies)) {
    for (const ic of best.involved_companies) {
      if (ic.company?.name) {
        if (ic.developer) devs.push(ic.company.name)
        if (ic.publisher) pubs.push(ic.company.name)
      }
    }
  }

  const rawDev = [...new Set(devs)].join(', ').trim()
  const rawPub = [...new Set(pubs)].join(', ').trim()

  // Self-published fallback: if developer is known but publisher is empty (or vice-versa), inherit
  const developer = rawDev || rawPub || null
  const publisher = rawPub || rawDev || null

  let release_date = ''
  if (best.first_release_date) {
    try {
      release_date = new Date(best.first_release_date * 1000).toISOString().split('T')[0]
    } catch {}
  }

  return {
    synopsis: synopsis || null,
    developer,
    publisher,
    release_date: release_date || null,
    genres: genres || null,
    igdbId: best.id,
    name: best.name,
  }
}

async function fetchIgdbBySteamAppId(steamAppId, cleanId, token, signal) {
  if (!steamAppId || !/^\d+$/.test(String(steamAppId).trim())) return null
  const body = `fields game.id, game.name, game.summary, game.storyline, game.first_release_date, game.genres.name, game.involved_companies.developer, game.involved_companies.publisher, game.involved_companies.company.name; where uid = "${String(steamAppId).trim()}"; limit 1;`
  try {
    const res = await fetch('https://api.igdb.com/v4/external_games', {
      method: 'POST',
      headers: {
        'Client-ID': cleanId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
      },
      body,
      signal,
    })
    if (!res.ok) return null
    const data = await res.json()
    if (Array.isArray(data) && data[0]?.game) {
      return parseIgdbGameRecord(data[0].game)
    }
  } catch {}
  return null
}

async function fetchIgdbMetadata(title, clientId, clientSecret, signal, steamAppId = null) {
  const cleanId = String(clientId || '').trim()
  const cleanSecret = String(clientSecret || '').trim()
  if ((!title && !steamAppId) || !cleanId || !cleanSecret) return null

  const token = await getIgdbToken(cleanId, cleanSecret)
  if (!token) return null

  // Strategy 2: If Steam App ID is available, query IGDB external_games directly
  if (steamAppId) {
    try {
      const fromSteam = await fetchIgdbBySteamAppId(steamAppId, cleanId, token, signal)
      if (fromSteam) return fromSteam
    } catch {}
  }

  // Strategy 1: Title search with multi-stage fallback cascade
  const queries = getTitleVariations(title)
  for (const queryTitle of queries) {
    if (signal?.aborted) break
    const escapedTitle = queryTitle.replace(/["\\]/g, '\\$&')
    const bodyQuery = `search "${escapedTitle}"; fields name, summary, storyline, first_release_date, genres.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name; limit 6;`

    try {
      const res = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: {
          'Client-ID': cleanId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
        },
        body: bodyQuery,
        signal,
      })

      if (res.ok) {
        const results = await res.json()
        if (Array.isArray(results) && results.length) {
          const lowerTarget = queryTitle.toLowerCase()
          const best = results.find((r) => r.name && r.name.toLowerCase() === lowerTarget) || results[0]
          const record = parseIgdbGameRecord(best)
          if (record) return record
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return null
      console.warn('[IGDB] Search error for', queryTitle, ':', err.message)
    }
  }

  return null
}

module.exports = {
  getIgdbToken,
  testIgdbConnection,
  fetchIgdbMetadata,
  stripTitleNoise,
  getTitleVariations,
  fetchIgdbBySteamAppId,
}

