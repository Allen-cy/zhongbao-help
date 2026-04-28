declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

let amapLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadAMap(): Promise<void> {
  if (amapLoaded && window.AMap) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const key = process.env.NEXT_PUBLIC_AMAP_KEY || '21a86f420ac2cb8b6d686c153ef1e497';
  const securityKey = process.env.NEXT_PUBLIC_AMAP_SECURITY_KEY || '432a8c672ebdf8818253a819446d54ef';

  window._AMapSecurityConfig = { securityJsCode: securityKey };

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    script.async = true;

    script.onload = () => { amapLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load AMap'));

    const timeout = setTimeout(() => {
      if (!window.AMap) reject(new Error('AMap load timeout'));
    }, 15000);

    const checkInterval = setInterval(() => {
      if (window.AMap) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        amapLoaded = true;
        resolve();
      }
    }, 100);

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

export async function searchPlaces(keywords: string): Promise<PlaceSuggestion[]> {
  if (!keywords || keywords.trim().length < 2) return [];

  await loadAMap();
  if (!window.AMap) return [];

  return new Promise((resolve) => {
    const AMap = window.AMap;

    AMap.plugin('AMap.PlaceSearch', () => {
      const placeSearch = new AMap.PlaceSearch({
        city: '廊坊',
        citylimit: false,
        pageSize: 10,
        pageIndex: 1,
      });

      placeSearch.search(keywords, (status: string, result: any) => {
        console.log('[PlaceSearch] status:', status, 'result:', JSON.stringify(result)?.slice(0, 300));

        if (status === 'complete' && result && result.poiList && result.poiList.pois) {
          const suggestions: PlaceSuggestion[] = result.poiList.pois.map((poi: any) => ({
            id: poi.id || '',
            name: poi.name || '',
            address: poi.address || '',
            district: poi.pname || '',
            location: poi.location ? { lat: poi.location.lat, lng: poi.location.lng } : undefined,
          }));
          resolve(suggestions);
        } else {
          resolve([]);
        }
      });
    });
  });
}
