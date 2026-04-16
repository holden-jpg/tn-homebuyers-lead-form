import { useRef, useEffect, useState, useCallback } from 'react';

const SCRIPT_ID = 'google-maps-script';

function parseAddressComponents(components) {
  const get = (type, nameType = 'long_name') =>
    components.find((c) => c.types.includes(type))?.[nameType] || '';

  const streetNumber = get('street_number');
  const route = get('route');

  return {
    propertyStreet: [streetNumber, route].filter(Boolean).join(' '),
    propertyCity: get('locality') || get('sublocality_level_1'),
    propertyState: get('administrative_area_level_1', 'short_name'),
    propertyZip: get('postal_code'),
  };
}

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    // Script already in DOM but not yet loaded — wait for it
    if (document.getElementById(SCRIPT_ID)) {
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function usePlacesAutocomplete(onSelect) {
  const inputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(!!window.google?.maps?.places);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;
    loadGoogleMaps(apiKey)
      .then(() => setIsLoaded(true))
      .catch(() => { /* Maps failed to load — input stays as plain text */ });
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Prevent Enter key from submitting the form while the dropdown is open
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') e.preventDefault();
    };
    inputRef.current.addEventListener('keydown', handleKeyDown);

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components'],
        types: ['address'],
      });

      const listener = autocomplete.addListener('place_changed', () => {
        try {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            onSelectRef.current({
              propertyAddress: place.formatted_address,
              ...parseAddressComponents(place.address_components || []),
            });
          }
        } catch {
          // Place selection failed — leave input value as-is
        }
      });

      return () => {
        window.google.maps.event.removeListener(listener);
        inputRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    } catch {
      // Autocomplete init failed — input falls back to plain text
      inputRef.current?.removeEventListener('keydown', handleKeyDown);
    }
  }, [isLoaded]);

  // Merge react-hook-form ref with our autocomplete ref
  const mergeRef = useCallback((registerRef) => (el) => {
    registerRef(el);
    inputRef.current = el;
  }, []);

  return mergeRef;
}
