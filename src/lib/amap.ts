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
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.Geolocation`;
    script.async = true;
    script.onload = () => { amapLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  await loadAMap();
  return new Promise((resolve) => {
    const geolocation = new window.AMap.Geolocation({ enableHighAccuracy: true });
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        resolve({ lat: result.position.lat, lng: result.position.lng });
      } else {
        // Default to Langfang, Hebei
        resolve({ lat: 39.5197, lng: 116.8544 });
      }
    });
  });
}
