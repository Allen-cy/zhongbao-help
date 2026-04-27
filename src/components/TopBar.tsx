'use client';

import Link from 'next/link';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-14 bg-zinc-950 border-b-2 border-zinc-800">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
        <h1 className="text-lg font-black text-red-600 tracking-tighter uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}>
          {title || 'LANGFANG_OPS'}
        </h1>
      </div>
      <Link href="/profile" className="flex items-center justify-center hover:bg-zinc-800 transition-colors rounded-sm p-1">
        <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
      </Link>
    </header>
  );
}
