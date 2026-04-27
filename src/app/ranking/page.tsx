'use client';

import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

interface RankingItem {
  rank: number;
  location: string;
  tags: string[];
  score: number;
}

const mockRankingData: RankingItem[] = [
  { rank: 1, location: '龙河高新区', tags: ['不让进小区', '6楼无梯', '门禁严格'], score: 98 },
  { rank: 2, location: '万达广场南侧', tags: ['商场难找', '电梯拥挤'], score: 85 },
  { rank: 3, location: '大学城商业街', tags: ['坡度陡', '态度恶劣'], score: 76 },
  { rank: 4, location: '会展中心附近', tags: ['无电梯', '大件重物'], score: 72 },
  { rank: 5, location: '中央公园商圈', tags: ['出餐慢', '单价极低'], score: 65 },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'area'>('daily');
  const [searchQuery, setSearchQuery] = useState('');

  const getScoreColor = (score: number) => {
    if (score > 90) return 'text-red-500 bg-red-50';
    if (score > 75) return 'text-yellow-500 bg-yellow-50';
    return 'text-gray-400 bg-gray-50';
  };

  const getRankDisplay = (rank: number) => {
    return rank.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="配送难点排行" />

      <div className="pt-20 px-4 space-y-4">
        {/* Search Input */}
        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索地址或商圈..."
              className="flex-1 outline-none text-sm font-['Inter'] uppercase placeholder-gray-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1 shadow-sm flex">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-[#ff544c] text-white'
                : 'text-gray-500'
            }`}
          >
            日排行
          </button>
          <button
            onClick={() => setActiveTab('area')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'area'
                ? 'bg-[#ff544c] text-white'
                : 'text-gray-500'
            }`}
          >
            区域排行
          </button>
        </div>

        {/* Ranking List */}
        <div className="space-y-3">
          {mockRankingData
            .filter((item) =>
              item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((item) => (
              <div
                key={item.rank}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className="text-4xl font-bold font-['Space_Grotesk'] text-gray-300 w-12">
                  {getRankDisplay(item.rank)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold font-['Space_Grotesk'] text-gray-800 mb-1">
                    {item.location}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>
              </div>
            ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
