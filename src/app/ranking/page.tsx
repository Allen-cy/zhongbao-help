'use client';

import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

interface RankingItem {
  rank: number;
  location_name: string;
  address: string;
  score: number;
  difficulty_label: string;
  tags: string[];
}

interface DashboardStats {
  totalReports: number;
  dangerZones: number;
  avgScore: number;
  activeRiders: number;
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'area'>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ totalReports: 0, dangerZones: 0, avgScore: 0, activeRiders: 0 });

  useEffect(() => {
    fetchRankings();
  }, [activeTab]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rankings?period=${activeTab === 'daily' ? 'daily' : 'area'}`);
      const data = await res.json();
      if (data.data) {
        setRankings(data.data);
        const scores = data.data.map((r: RankingItem) => r.score);
        setStats({
          totalReports: data.data.length,
          dangerZones: data.data.filter((r: RankingItem) => r.score >= 75).length,
          avgScore: scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
          activeRiders: new Set(data.data.map((r: RankingItem) => r.location_name)).size,
        });
      } else {
        setRankings([]);
        setStats({ totalReports: 0, dangerZones: 0, avgScore: 0, activeRiders: 0 });
      }
    } catch {
      setRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const getDifficultyLabel = (score: number) => {
    if (score >= 90) return '极其危险';
    if (score >= 75) return '严重';
    if (score >= 50) return '高难度';
    return '一般';
  };

  const filtered = rankings.filter((item) =>
    item.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="数据驾驶舱" />

      <div className="pt-20 px-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-red-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">今日上报</span>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-gray-800">{stats.totalReports}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-yellow-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">危险区域</span>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-gray-800">{stats.dangerZones}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-blue-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">平均难度</span>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-gray-800">{stats.avgScore}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-green-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">活跃骑手</span>
            </div>
            <div className="text-3xl font-bold font-['Space_Grotesk'] text-gray-800">{stats.activeRiders}</div>
          </div>
        </div>

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
              activeTab === 'daily' ? 'bg-[#ff544c] text-white' : 'text-gray-500'
            }`}
          >
            日排行
          </button>
          <button
            onClick={() => setActiveTab('area')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'area' ? 'bg-[#ff544c] text-white' : 'text-gray-500'
            }`}
          >
            区域排行
          </button>
        </div>

        {/* Ranking List */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">加载中...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
            <p>暂无数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.rank} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className="text-4xl font-bold font-['Space_Grotesk'] text-gray-300 w-12">
                  {item.rank.toString().padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold font-['Space_Grotesk'] text-gray-800 mb-1">
                    {item.location_name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 5).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(item.score)}`}>
                    {item.score}
                  </div>
                  <span className="text-xs text-gray-400">{getDifficultyLabel(item.score)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
