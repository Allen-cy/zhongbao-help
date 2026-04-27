'use client';

import { useEffect, useRef, useState } from 'react';
import { loadAMap } from '@/lib/amap';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';

const RISK_ALERTS = [
  { id: 1, icon: 'gavel', title: '大学城西门', desc: '虚假单高发区。多位骑手已反馈。', color: 'primary-container' },
  { id: 2, icon: 'traffic', title: '广阳大道', desc: '路段拥堵。预计延迟15分钟。', color: 'secondary-fixed' },
];

export default function HomePage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const initMap = async () => {
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

          // Add markers
          const markers = [
            { position: [116.8567, 39.5183], title: '万达广场', score: 98, color: '#ff544c' },
            { position: [116.8520, 39.5200], title: '龙河高新区', score: 85, color: '#ffba38' },
          ];

          markers.forEach(({ position, title, score, color }) => {
            const marker = new AMap.Marker({
              position,
              title,
              label: { content: `<div style="background:#201f1f;border:2px solid ${color};color:#e5e2e1;padding:2px 6px;font-size:12px;font-family:Space Grotesk;font-weight:700;border-radius:4px;">${title}</div>`, direction: 'bottom' },
            });
            map.add(marker);
          });

          setMapReady(true);
        }
      } catch (e) {
        console.error('Map load failed', e);
        setMapReady(true);
      }
    };
    initMap();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 pt-14 flex flex-col">
      <TopBar />

      {/* Map Container */}
      <main className="relative flex-1 w-full">
        <div ref={mapRef} className="absolute inset-0 w-full h-full bg-surface-dim" />

        {/* Overlay Content */}
        <div className="absolute inset-x-0 top-0 p-edge-margin z-10 pointer-events-none flex flex-col gap-md">
          {/* Stats Card */}
          <div className="bg-surface-container border-2 border-primary-container p-sm rounded-DEFAULT flex flex-col gap-xs pointer-events-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-md text-on-surface uppercase tracking-tight">全城垃圾单指数</h2>
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="flex items-end gap-sm">
              <span className="font-data-display text-primary-container leading-none">87</span>
              <span className="font-label-xl text-error mb-1 uppercase tracking-wider bg-error-container/50 px-1 border border-error">严重 - 避开万达广场</span>
            </div>
            {/* Progress Bar */}
            <div className="h-4 w-full bg-surface-container-highest mt-2 flex gap-1 p-[2px] border border-surface-variant">
              {[...Array(7)].map((_, i) => <div key={i} className="h-full bg-primary-container w-[10%]" />)}
              <div className="h-full bg-primary-container w-[5%]" />
              <div className="h-full bg-transparent flex-1" />
            </div>
          </div>

          {/* Context Title */}
          <h2 className="font-headline-lg text-inverse-surface uppercase bg-surface-container-low/90 inline-block px-sm py-xs border-l-4 border-secondary-fixed self-start backdrop-blur-sm shadow-md">
            黑榜分布地图
          </h2>

          {/* Risk Alerts */}
          <div className="bg-surface-container/95 border-2 border-outline-variant p-sm rounded-DEFAULT max-w-md backdrop-blur-md shadow-lg pointer-events-auto flex flex-col gap-sm">
            <h3 className="font-label-xl text-surface-tint flex items-center gap-2 uppercase tracking-wide border-b-2 border-surface-variant pb-xs">
              <span className="material-symbols-outlined text-[18px]">radar</span> 实时风险预警
            </h3>
            <ul className="flex flex-col gap-3">
              {RISK_ALERTS.map((alert) => (
                <li key={alert.id} className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>{alert.icon}</span>
                  <div>
                    <p className="font-body-md font-bold uppercase text-surface-tint">{alert.title}</p>
                    <p className="font-label-md text-outline">{alert.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAB */}
        <div className="absolute bottom-6 right-edge-margin z-40">
          <a href="/report" className="bg-primary-container text-on-primary-container h-touch-target-min px-md flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all no-underline">
            <span className="material-symbols-outlined font-bold">report</span>
            <span className="font-label-xl uppercase font-bold tracking-widest whitespace-nowrap">标记垃圾单</span>
          </a>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
