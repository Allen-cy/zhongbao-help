'use client';

import { useEffect, useRef, useCallback } from 'react';
import { loadAMap } from '@/lib/amap';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';

export default function HomePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const initMap = useCallback(async () => {
    try {
      await loadAMap();
      if (mapRef.current && !mapInstanceRef.current) {
        const AMap = (window as any).AMap;
        const map = new AMap.Map(mapRef.current, {
          zoom: 13,
          center: [116.8544, 39.5197],
          mapStyle: 'amap://styles/darkblue',
        });
        mapInstanceRef.current = map;
      }
    } catch (e) {
      console.error('Map init failed', e);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
        initMap();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', initMap);
    initMap();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', initMap);
    };
  }, [initMap]);

  return (
    <div className="min-h-screen bg-background pb-20 pt-14 flex flex-col">
      <TopBar />
      <main className="relative flex-1 w-full">
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-6 right-4 z-40">
          <a
            href="/report"
            className="bg-[#ff544c] text-white h-12 px-5 flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all no-underline rounded-xl"
          >
            <span className="material-symbols-outlined font-bold">report</span>
            <span className="font-bold tracking-wider whitespace-nowrap">标记垃圾单</span>
          </a>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
