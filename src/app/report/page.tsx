'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import { searchPlaces, PlaceSuggestion, getCurrentPosition } from '@/lib/amap';

const PICKUP_TAGS = [
  { label: '商场难找', score: 20 },
  { label: '出餐慢', score: 15 },
  { label: '态度恶劣', score: 10 },
];

const DELIVERY_TAGS = [
  { label: '无电梯', score: 30 },
  { label: '门禁严格', score: 25 },
  { label: '坡度陡', score: 15 },
];

const VALUE_TAGS = [
  { label: '单价极低', score: 10 },
  { label: '大件重物', score: 20 },
];

export default function ReportPage() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceSuggestion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pickupTags, setPickupTags] = useState<string[]>([]);
  const [deliveryTags, setDeliveryTags] = useState<string[]>([]);
  const [valueTags, setValueTags] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('廊坊市广阳区');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const score = [...pickupTags, ...deliveryTags, ...valueTags].reduce((sum, tag) => {
    const allTags = [...PICKUP_TAGS, ...DELIVERY_TAGS, ...VALUE_TAGS];
    const found = allTags.find(t => t.label === tag);
    return sum + (found?.score || 0);
  }, 0);

  const getDifficultyLabel = (s: number) => {
    if (s >= 60) return '极其困难';
    if (s >= 40) return '困难';
    if (s >= 20) return '一般';
    return '未评估';
  };

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchPlaces(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (e) {
      console.error('Search failed', e);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (searchQuery) {
      searchTimeout.current = setTimeout(() => handleSearch(searchQuery), 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, handleSearch]);

  const selectPlace = (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);
    setShowSuggestions(false);
  };

  const toggleTag = (tag: string, type: 'pickup' | 'delivery' | 'value') => {
    if (type === 'pickup') {
      setPickupTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    } else if (type === 'delivery') {
      setDeliveryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    } else {
      setValueTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlace) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/trash-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: 'anonymous',
          latitude: selectedPlace.location?.lat || 39.5197,
          longitude: selectedPlace.location?.lng || 116.8544,
          location_name: selectedPlace.name,
          score,
          difficulty_label: getDifficultyLabel(score),
          pickup_tags: pickupTags,
          delivery_tags: deliveryTags,
          order_value_tags: valueTags,
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/ranking';
        }, 1500);
      }
    } catch (e) {
      console.error('Submit failed', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-on-background pb-20 pt-14 flex flex-col items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <h2 className="font-headline-lg text-secondary uppercase">提交成功</h2>
          <p className="font-body-md text-surface-variant mt-2">感谢你的标记，正在跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background pb-20 pt-14">
      <TopBar />
      
      <main className="max-w-3xl mx-auto px-edge-margin py-lg space-y-lg">
        {/* Title */}
        <section className="flex flex-col items-center justify-center space-y-sm">
          <h1 className="font-headline-xl text-headline-xl text-center uppercase text-primary-container">标记垃圾单</h1>
          <p className="font-body-md text-surface-variant text-center">上报高难度订单，提醒同行避坑。</p>
          
          {/* Score Circle */}
          <div className="relative w-48 h-48 mt-md flex items-center justify-center rounded-full border-[8px] border-surface-variant">
            <div className="absolute inset-0 rounded-full border-[8px] border-error" style={{ clipPath: `polygon(50% 50%, 0 0, ${Math.min(score, 100)}% 0, ${Math.min(score, 100)}% 100%, 0 100%)` }} />
            <div className="flex flex-col items-center justify-center z-10 bg-surface w-40 h-40 rounded-full border-2 border-surface-variant">
              <span className="font-data-display text-data-display text-error">{score}</span>
              <span className="font-label-xl text-error uppercase">{getDifficultyLabel(score)}</span>
            </div>
          </div>
        </section>

        {/* Location Search */}
        <section className="relative">
          <div className="bg-surface-container border-2 border-surface-variant rounded flex items-center justify-between p-md">
            <div className="flex items-center gap-sm flex-1">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <div className="flex-1">
                <h2 className="font-label-xl uppercase text-on-surface">
                  {selectedPlace ? '已选位置' : '当前位置'}
                </h2>
                <p className="font-body-md text-surface-variant truncate">
                  {selectedPlace ? selectedPlace.name : currentLocation}
                </p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPlace(null); setSearchQuery(''); }}
              className="bg-surface-variant text-on-surface font-label-xl px-sm py-xs border-2 border-outline-variant hover:bg-surface-bright transition-colors uppercase"
            >
              {selectedPlace ? '修改' : '搜索'}
            </button>
          </div>

          {/* Search Input & Suggestions */}
          {selectedPlace === null && (
            <div className="relative mt-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-surface-tint">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="搜索地址或商圈..."
                  className="w-full bg-surface-container-high border-2 border-surface-variant text-on-surface focus:border-primary-container h-touch-target-min pl-12 pr-4 font-body-lg text-body-lg placeholder:text-inverse-surface/40 uppercase"
                />
                {isSearching && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-surface-tint animate-spin">sync</span>
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-surface-container border-2 border-surface-variant mt-1 max-h-64 overflow-y-auto">
                  {suggestions.map(place => (
                    <li key={place.id}>
                      <button
                        onClick={() => selectPlace(place)}
                        className="w-full text-left px-4 py-3 border-b border-surface-variant last:border-b-0 hover:bg-surface-container-high transition-colors"
                      >
                        <p className="font-body-md text-on-surface font-medium">{place.name}</p>
                        <p className="font-label-md text-surface-variant truncate">{place.address || place.district}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Tag Sections */}
        <section className="space-y-md">
          {/* Pickup Difficulties */}
          <div className="bg-surface-container border-2 border-surface-variant p-md">
            <h3 className="font-headline-md text-on-surface mb-sm uppercase border-b-2 border-surface-variant pb-xs">取餐难点</h3>
            <div className="flex flex-wrap gap-sm mt-sm">
              {PICKUP_TAGS.map(({ label, score: tagScore }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'pickup')}
                  className={`border-2 font-label-xl px-md py-sm uppercase flex items-center gap-xs transition-colors ${pickupTags.includes(label)
                    ? 'bg-error-container border-error text-on-error-container'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-error hover:text-error'
                  }`}
                >
                  {label} <span className="font-label-md opacity-75">+{tagScore}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Difficulties */}
          <div className="bg-surface-container border-2 border-surface-variant p-md">
            <h3 className="font-headline-md text-on-surface mb-sm uppercase border-b-2 border-surface-variant pb-xs">送餐难点</h3>
            <div className="flex flex-wrap gap-sm mt-sm">
              {DELIVERY_TAGS.map(({ label, score: tagScore }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'delivery')}
                  className={`border-2 font-label-xl px-md py-sm uppercase flex items-center gap-xs transition-colors ${deliveryTags.includes(label)
                    ? 'bg-error-container border-error text-on-error-container'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-error hover:text-error'
                  }`}
                >
                  {label} <span className="font-label-md opacity-75">+{tagScore}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Value */}
          <div className="bg-surface-container border-2 border-surface-variant p-md">
            <h3 className="font-headline-md text-on-surface mb-sm uppercase border-b-2 border-surface-variant pb-xs">订单性价比</h3>
            <div className="flex flex-wrap gap-sm mt-sm">
              {VALUE_TAGS.map(({ label, score: tagScore }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'value')}
                  className={`border-2 font-label-xl px-md py-sm uppercase flex items-center gap-xs transition-colors ${valueTags.includes(label)
                    ? 'bg-error-container border-error text-on-error-container'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-error hover:text-error'
                  }`}
                >
                  {label} <span className="font-label-md opacity-75">+{tagScore}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <section className="mt-xl">
          <button
            onClick={handleSubmit}
            disabled={!selectedPlace || submitting}
            className={`w-full h-touch-target-min font-headline-lg uppercase py-md border-2 flex items-center justify-center gap-sm transition-colors ${
              !selectedPlace || submitting
                ? 'bg-surface-container text-surface-variant border-surface-variant cursor-not-allowed'
                : 'bg-error text-on-error border-error hover:bg-error-container hover:text-error'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            {submitting ? '提交中...' : '立即提交标记'}
          </button>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
