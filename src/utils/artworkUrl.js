export function normalizeArtworkUrl(url) {
  if (!url || typeof url !== 'string') return url;

  // Remote URLs (Steam CDN, SteamGridDB, fastly, https) stay untouched
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // Already transformed local-file protocol
  if (url.startsWith('local-file://')) {
    return url;
  }

  let cleanPath = url;

  // Strip file:/// or file://
  if (cleanPath.startsWith('file:///')) {
    cleanPath = cleanPath.slice(8);
  } else if (cleanPath.startsWith('file://')) {
    cleanPath = cleanPath.slice(7);
  }

  // Normalize Windows backslashes to forward slashes
  cleanPath = cleanPath.replace(/\\/g, '/');

  // Strip leading slash before drive letter if present (e.g., /C:/Users -> C:/Users)
  if (/^\/[a-zA-Z]:/.test(cleanPath)) {
    cleanPath = cleanPath.slice(1);
  }

  // Encode URI components cleanly so spaces in folder names don't break the loader
  const parts = cleanPath.split('/');
  const encodedParts = parts.map((part, index) => {
    // Keep drive letter like C: unencoded
    if (index === 0 && /^[a-zA-Z]:$/.test(part)) return part;
    return encodeURIComponent(decodeURIComponent(part));
  });

  return `local-file:///${encodedParts.join('/')}`;
}