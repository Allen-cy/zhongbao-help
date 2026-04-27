'use client';

import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-on-background pb-20 pt-14">
      <TopBar />
      <main className="max-w-3xl mx-auto px-edge-margin pt-lg space-y-lg">
        {/* User Identity */}
        <section className="flex flex-col items-center justify-center space-y-sm">
          <div className="w-32 h-32 rounded-full border-4 border-surface-variant overflow-hidden mb-2 relative">
            <img alt="Rider" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"/>
            <div className="absolute bottom-0 left-0 w-full bg-primary-container text-on-primary-container text-center py-1 font-label-md font-bold uppercase">活跃中</div>
          </div>
          <h2 className="font-headline-lg text-center uppercase tracking-tight">骑手 8492-X</h2>
          <div className="flex items-center gap-xs text-secondary px-sm py-1 border-2 border-secondary rounded-sm">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="font-label-xl uppercase">精英认证</span>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-sm">
          <div className="bg-surface-container border-2 border-surface-variant rounded-DEFAULT p-md flex flex-col justify-between">
            <div className="flex items-start justify-between mb-lg">
              <span className="font-label-xl text-surface-tint uppercase">累计标记</span>
              <span className="material-symbols-outlined text-surface-tint">flag</span>
            </div>
            <div className="font-data-display text-on-surface">1,402</div>
          </div>
          <div className="bg-surface-container border-2 border-surface-variant rounded-DEFAULT p-md flex flex-col justify-between">
            <div className="flex items-start justify-between mb-lg">
              <span className="font-label-xl text-secondary uppercase">信誉分</span>
              <span className="material-symbols-outlined text-secondary">star</span>
            </div>
            <div className="font-data-display text-on-surface">98.4<span className="text-headline-md font-headline-md">%</span></div>
          </div>
          <div className="col-span-2 bg-surface-container border-2 border-surface-variant rounded-DEFAULT p-md">
            <div className="flex items-start justify-between mb-sm">
              <span className="font-label-xl text-inverse-surface uppercase">排名：前 5%</span>
              <span className="font-label-md text-surface-variant uppercase">下一等级：还差 15K 积分</span>
            </div>
            <div className="w-full bg-surface-container-lowest h-3 rounded-sm overflow-hidden mb-2 border border-surface-variant">
              <div className="bg-primary-container h-full w-[85%] rounded-sm" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px)' }}></div>
            </div>
          </div>
        </section>

        {/* Action List */}
        <section className="space-y-sm">
          {[
            { icon: 'history', label: '我的标记', href: '#' },
            { icon: 'help_center', label: '帮助中心', href: '#' },
            { icon: 'settings', label: '设置', href: '#' },
          ].map((item) => (
            <a key={item.icon} className="flex items-center justify-between p-md bg-surface-container-high border-2 border-surface-variant rounded-DEFAULT hover:border-surface-tint transition-colors group min-h-touch-target-min cursor-pointer" href={item.href}>
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-surface-tint transition-colors">{item.icon}</span>
                <span className="font-headline-md text-on-surface">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </a>
          ))}
        </section>

        {/* Log Out */}
        <section className="pt-md">
          <button className="w-full min-h-touch-target-min bg-transparent border-2 border-error text-error font-headline-md uppercase tracking-wide hover:bg-error hover:text-on-error transition-colors rounded-DEFAULT flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">logout</span> 退出登录
          </button>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
