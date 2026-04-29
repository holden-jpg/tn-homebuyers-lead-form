const SESSION_KEY = 'thb_utms';
const SOURCE_URL_KEY = 'thb_source_url';

// Capture once at module load time, before anything changes the URL
const CAPTURED_UTMS = (() => {
  const params = new URLSearchParams(window.location.search);

  const fromUrl = {
    utmSource:   params.get('utm_source')   || '',
    utmMedium:   params.get('utm_medium')   || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm:     params.get('utm_term')     || '',
    utmContent:  params.get('utm_content')  || '',
    utmId:       params.get('utm_id')       || '',
    utmAdGroup:  params.get('utm_adgroup')  || '',
    gclid:       params.get('gclid')        || '',
    fbclid:      params.get('fbclid')       || '',
  };

  const hasUrlParams = Object.values(fromUrl).some(Boolean);

  if (hasUrlParams) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(fromUrl));
    sessionStorage.setItem(SOURCE_URL_KEY, window.location.href);
    return fromUrl;
  }

  // No UTM params — preserve stored source URL if present, otherwise store current page as direct landing
  try {
    const storedUrl = sessionStorage.getItem(SOURCE_URL_KEY);
    if (!storedUrl) sessionStorage.setItem(SOURCE_URL_KEY, window.location.href);

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // session storage unavailable or corrupted
  }

  return fromUrl;
})();

export function useUtmParams() {
  return CAPTURED_UTMS;
}

export function getCapturedSourceUrl() {
  try {
    return sessionStorage.getItem(SOURCE_URL_KEY) || window.location.href;
  } catch {
    return window.location.href;
  }
}