'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const navItems = [
    { label: '首页', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: '标记', path: '/report', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: '排行', path: '/ranking', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { label: '我的', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center w-16 h-full ${
              isActive ? 'text-[#ff544c]' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
