'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

export default function ProfilePage() {
  const [stats, setStats] = useState({ totalMarks: 0, avgScore: 0, locationsCount: 0 });

  useEffect(() => {
    fetch('/api/trash-orders')
      .then(r => r.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const orders = data.data;
          setStats({
            totalMarks: orders.length,
            avgScore: Math.round(orders.reduce((s: number, o: any) => s + o.score, 0) / orders.length),
            locationsCount: new Set(orders.map((o: any) => o.location_name)).size,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-14">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">

        {/* User Card */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#ff544c] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <h2 className="font-bold text-lg text-gray-800">匿名骑手</h2>
          <p className="text-sm text-gray-400 mt-1">开始使用 App 标记垃圾单</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#ff544c]">{stats.totalMarks}</div>
            <div className="text-xs text-gray-400 uppercase mt-1 tracking-wide">累计标记</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#ff544c]">{stats.avgScore || '-'}</div>
            <div className="text-xs text-gray-400 uppercase mt-1 tracking-wide">平均难度</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold font-['Space_Grotesk'] text-[#ff544c]">{stats.locationsCount}</div>
            <div className="text-xs text-gray-400 uppercase mt-1 tracking-wide">标记地点</div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#ff544c] rounded-2xl p-5 text-white text-center">
          <p className="text-sm mb-3 opacity-90">帮助同行避坑，从标记垃圾单开始</p>
          <Link href="/report" className="inline-flex items-center gap-2 bg-white text-[#ff544c] font-bold px-5 py-3 rounded-xl uppercase text-sm tracking-wide">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
            去标记垃圾单
          </Link>
        </section>

        {/* Menu */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {[
            { icon: 'history', label: '帮助中心' },
            { icon: 'info', label: '关于 App' },
          ].map((item) => (
            <div key={item.icon} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">{item.icon}</span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </div>
          ))}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
