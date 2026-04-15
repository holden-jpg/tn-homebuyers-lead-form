const SESSION_KEY = 'thb_utms';

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
    // Fresh params in the URL — save them and use them
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  // No params in URL — fall back to session storage
  try {
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