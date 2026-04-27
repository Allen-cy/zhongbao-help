declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

let amapLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadAMap(): Promise<void> {
  if (amapLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const key = process.env.NEXT_PUBLIC_AMAP_KEY || '21a86f420ac2cb8b6d686c153ef1e497';
  const securityKey = process.env.NEXT_PUBLIC_AMAP_SECURITY_KEY || '432a8c672ebdf8818253a819446d54ef';

  window._AMapSecurityConfig = { securityJsCode: securityKey };

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    script.async = true;
    script.onload = () => { amapLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load AMap'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  await loadAMap();
  return new Promise((resolve) => {
    const AMap = window.AMap;
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({ enableHighAccuracy: true });
      geolocation.getCurrentPosition((status: string, result: any) => {
        if (status === 'complete') {
          resolve({ lat: result.position.lat, lng: result.position.lng });
        } else {
          resolve({ lat: 39.5197, lng: 116.8544 });
        }
      });
    });
  });
}

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  district: string;
  location?: { lat: number; lng: number };
}

export function searchPlaces(keywords: string): Promise<PlaceSuggestion[]> {
  return new Promise(async (resolve) => {
    await loadAMap();
    const AMap = window.AMap;

    AMap.plugin('AMap.Autocomplete', () => {
      const autocomplete = new AMap.Autocomplete({ city: '廊坊' });
      autocomplete.search(keywords, (status: string, result: any) => {
        if (status === 'complete' && result && result.tips) {
          const suggestions: PlaceSuggestion[] = result.tips
            .filter((tip: any) => tip.id && tip.name)
            .map((tip: any) => ({
              id: tip.id,
              name: tip.name,
              address: tip.address || '',
              district: tip.district || '',
              location: tip.location ? { lat: tip.location.lat, lng: tip.location.lng } : undefined,
            }));
          resolve(suggestions);
        } else {
          resolve([]);
        }
      });
    });
  });
}
