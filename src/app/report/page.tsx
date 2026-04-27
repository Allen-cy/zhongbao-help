'use client';

import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

interface Tag {
  id: string;
  label: string;
  score: number;
}

const pickupTags: Tag[] = [
  { id: 'mall', label: '商场难找', score: 20 },
  { id: 'slow', label: '出餐慢', score: 15 },
  { id: 'rude', label: '态度恶劣', score: 10 },
];

const deliveryTags: Tag[] = [
  { id: 'noElevator', label: '无电梯', score: 30 },
  { id: 'gate', label: '门禁严格', score: 25 },
  { id: 'slope', label: '坡度陡', score: 15 },
];

const orderTags: Tag[] = [
  { id: 'lowPrice', label: '单价极低', score: 10 },
  { id: 'heavy', label: '大件重物', score: 20 },
];

export default function ReportPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const allTags = [...pickupTags, ...deliveryTags, ...orderTags];
  const totalScore = selectedTags.reduce((sum, tagId) => {
    const tag = allTags.find((t) => t.id === tagId);
    return sum + (tag?.score || 0);
  }, 0);

  const handleSubmit = () => {
    if (selectedTags.length === 0) {
      alert('请至少选择一个标记项');
      return;
    }
    alert(`已提交标记，总计 ${totalScore} 分`);
    setSelectedTags([]);
  };

  const isTagSelected = (tagId: string) => selectedTags.includes(tagId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar title="标记垃圾单" />

      <div className="pt-20 px-4 space-y-6">
        {/* Location Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#ff544c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-500">当前位置</span>
          </div>
          <p className="text-lg font-semibold font-['Space_Grotesk'] text-gray-800">廊坊市广阳区</p>
        </div>

        {/* Pickup Difficulties */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-3">取餐难点</h3>
          <div className="flex flex-wrap gap-2">
            {pickupTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                  isTagSelected(tag.id)
                    ? 'border-[#ff544c] bg-[#ffb4ab] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#ff544c]'
                }`}
              >
                {tag.label}
                <span className={`ml-1 ${isTagSelected(tag.id) ? '' : 'text-[#ff544c]'}`}>+{tag.score}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Difficulties */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-3">配送难点</h3>
          <div className="flex flex-wrap gap-2">
            {deliveryTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                  isTagSelected(tag.id)
                    ? 'border-[#ff544c] bg-[#ffb4ab] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#ff544c]'
                }`}
              >
                {tag.label}
                <span className={`ml-1 ${isTagSelected(tag.id) ? '' : 'text-[#ff544c]'}`}>+{tag.score}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Value */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-3">订单价值</h3>
          <div className="flex flex-wrap gap-2">
            {orderTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                  isTagSelected(tag.id)
                    ? 'border-[#ff544c] bg-[#ffb4ab] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#ff544c]'
                }`}
              >
                {tag.label}
                <span className={`ml-1 ${isTagSelected(tag.id) ? '' : 'text-[#ff544c]'}`}>+{tag.score}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Score Display */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-medium text-gray-500 mb-4">危险评分</h3>
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-[#ff544c] transition-all duration-300"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((totalScore / 100) * 2 * Math.PI)}% ${50 - 50 * Math.cos((totalScore / 100) * 2 * Math.PI)}%, 50% 50%)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold font-['Space_Grotesk'] text-[#ff544c]">{totalScore}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#ff544c] text-white font-semibold rounded-2xl shadow-md hover:bg-[#e64a42] transition-colors"
        >
          提交标记
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
