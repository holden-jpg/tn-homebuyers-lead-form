// Capture once at module load time, before anything changes the URL
const CAPTURED_UTMS = (() => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
    utmId: params.get('utm_id') || '',
    utmAdGroup: params.get('utm_adgroup') || '',
  };
})();

export function useUtmParams() {
  return CAPTURED_UTMS;
}