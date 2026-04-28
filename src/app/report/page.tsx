'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import TopBar from '@/components/TopBar';
import { searchPlaces, PlaceSuggestion } from '@/lib/amap';

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
  const [customTag, setCustomTag] = useState('');
  const [currentLocation] = useState('廊坊市广阳区');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [hygieneScore, setHygieneScore] = useState(0);
  const [hasPhysicalStore, setHasPhysicalStore] = useState<boolean | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const allFixedTags = [...PICKUP_TAGS, ...DELIVERY_TAGS, ...VALUE_TAGS];
  const customScore = customTag.trim().length >= 2 ? 10 : 0;

  const score = [...pickupTags, ...deliveryTags, ...valueTags].reduce((sum, tag) => {
    const found = allFixedTags.find(t => t.label === tag);
    return sum + (found?.score || 0);
  }, 0) + customScore;

  const getDifficultyLabel = (s: number) => {
    if (s >= 60) return '极其困难';
    if (s >= 40) return '困难';
    if (s >= 20) return '一般';
    return '未评估';
  };

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    setIsSearching(true);
    try {
      const results = await searchPlaces(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (e) {
      console.error('Search failed', e);
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
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchQuery, handleSearch]);

  const selectPlace = (place: PlaceSuggestion) => {
    setSelectedPlace(place);
    setSearchQuery(place.name);
    setShowSuggestions(false);
  };

  const toggleTag = (tag: string, type: 'pickup' | 'delivery' | 'value') => {
    if (type === 'pickup') setPickupTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
    else if (type === 'delivery') setDeliveryTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
    else setValueTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
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
          custom_tag: customTag.trim() || null,
          hygiene_score: hygieneScore || null,
          has_physical_store: hasPhysicalStore,
          store_name: storeName.trim() || null,
        }),
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => { window.location.href = '/ranking'; }, 1500);
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
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Title & Score */}
        <section className="flex flex-col items-center justify-center space-y-2">
          <h1 className="font-headline-xl text-center uppercase text-primary-container">标记垃圾单</h1>
          <p className="font-body-md text-surface-variant text-center">上报高难度订单，提醒同行避坑。</p>
          <div className="relative w-40 h-40 mt-4 flex items-center justify-center rounded-full border-[6px] border-surface-variant">
            <div className="flex flex-col items-center justify-center z-10 bg-surface w-32 h-32 rounded-full border-2 border-surface-variant">
              <span className="text-4xl font-bold text-error">{score}</span>
              <span className="text-sm text-error uppercase">{getDifficultyLabel(score)}</span>
            </div>
          </div>
        </section>

        {/* Location Search */}
        <section className="relative">
          <div className="bg-surface-container border-2 border-surface-variant rounded-xl flex items-center justify-between p-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <div className="flex-1">
                <h2 className="font-label-xl uppercase text-on-surface">{selectedPlace ? '已选位置' : '当前位置'}</h2>
                <p className="font-body-md text-surface-variant truncate">{selectedPlace ? selectedPlace.name : currentLocation}</p>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPlace(null); setSearchQuery(''); }}
              className="bg-surface-variant text-on-surface font-label-xl px-3 py-1 border-2 border-outline-variant hover:bg-surface-bright transition-colors uppercase text-sm"
            >
              {selectedPlace ? '修改' : '搜索'}
            </button>
          </div>

          {selectedPlace === null && (
            <div className="relative mt-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-surface-tint text-lg">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="搜索地址或商圈..."
                  className="w-full bg-white border-2 border-gray-300 text-gray-900 focus:border-[#ff544c] h-12 pl-12 pr-4 text-base placeholder:text-gray-400 rounded-xl"
                />
                {isSearching && <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-surface-tint animate-spin">sync</span>}
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-surface-container border-2 border-surface-variant mt-1 max-h-64 overflow-y-auto rounded-xl">
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

        {/* Difficulty Tags */}
        <section className="space-y-4">
          {/* Pickup */}
          <div className="bg-surface-container border-2 border-surface-variant p-4 rounded-xl">
            <h3 className="font-headline-md text-on-surface mb-3 uppercase border-b-2 border-surface-variant pb-2">取餐难点</h3>
            <div className="flex flex-wrap gap-2">
              {PICKUP_TAGS.map(({ label, score: ts }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'pickup')}
                  className={`border-2 text-sm px-3 py-2 uppercase flex items-center gap-1 transition-colors rounded-lg ${pickupTags.includes(label)
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-red-500'
                  }`}
                >
                  {label} <span className="text-xs opacity-70">+{ts}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-surface-container border-2 border-surface-variant p-4 rounded-xl">
            <h3 className="font-headline-md text-on-surface mb-3 uppercase border-b-2 border-surface-variant pb-2">送餐难点</h3>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_TAGS.map(({ label, score: ts }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'delivery')}
                  className={`border-2 text-sm px-3 py-2 uppercase flex items-center gap-1 transition-colors rounded-lg ${deliveryTags.includes(label)
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-red-500'
                  }`}
                >
                  {label} <span className="text-xs opacity-70">+{ts}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value */}
          <div className="bg-surface-container border-2 border-surface-variant p-4 rounded-xl">
            <h3 className="font-headline-md text-on-surface mb-3 uppercase border-b-2 border-surface-variant pb-2">订单性价比</h3>
            <div className="flex flex-wrap gap-2">
              {VALUE_TAGS.map(({ label, score: ts }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label, 'value')}
                  className={`border-2 text-sm px-3 py-2 uppercase flex items-center gap-1 transition-colors rounded-lg ${valueTags.includes(label)
                    ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-surface text-on-surface border-surface-variant hover:border-red-500'
                  }`}
                >
                  {label} <span className="text-xs opacity-70">+{ts}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag */}
          <div className="bg-surface-container border-2 border-surface-variant p-4 rounded-xl">
            <h3 className="font-headline-md text-on-surface mb-3 uppercase border-b-2 border-surface-variant pb-2">其他情况</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={e => setCustomTag(e.target.value)}
                placeholder="手动输入其他难点..."
                maxLength={20}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm placeholder:text-gray-400"
              />
              {customTag.trim().length >= 2 && (
                <span className="flex items-center px-3 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg text-sm font-bold">
                  +10
                </span>
              )}
            </div>
            {customTag.trim().length > 0 && customTag.trim().length < 2 && (
              <p className="text-xs text-gray-500 mt-1">至少输入2个字符</p>
            )}
          </div>
        </section>

        {/* Merchant Info */}
        <section className="bg-surface-container border-2 border-surface-variant p-4 rounded-xl space-y-4">
          <h3 className="font-headline-md text-on-surface uppercase border-b-2 border-surface-variant pb-2">商家信息（选填）</h3>

          {/* Store Name */}
          <div>
            <label className="font-label-md text-surface-variant uppercase mb-1 block">商家名称</label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              placeholder="输入商家名称..."
              maxLength={30}
              className="w-full bg-white border-2 border-gray-300 text-gray-900 px-3 py-2 rounded-lg text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Hygiene Score */}
          <div>
            <label className="font-label-md text-surface-variant uppercase mb-2 block">卫生评分</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setHygieneScore(hygieneScore === star ? 0 : star)}
                  className="text-3xl transition-transform active:scale-90"
                >
                  <span className={star <= hygieneScore ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
              <span className="flex items-center text-xs text-surface-variant ml-2">
                {hygieneScore === 0 ? '未评分' : `${hygieneScore}/5`}
              </span>
            </div>
          </div>

          {/* Physical Store */}
          <div>
            <label className="font-label-md text-surface-variant uppercase mb-2 block">有无实体门店</label>
            <div className="flex gap-3">
              <button
                onClick={() => setHasPhysicalStore(true)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium uppercase transition-colors ${hasPhysicalStore === true
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-surface border-surface-variant text-on-surface'
                }`}
              >
                有实体店
              </button>
              <button
                onClick={() => setHasPhysicalStore(false)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium uppercase transition-colors ${hasPhysicalStore === false
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'bg-surface border-surface-variant text-on-surface'
                }`}
              >
                无实体店
              </button>
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedPlace || submitting}
          className={`w-full h-14 font-headline-lg uppercase py-4 border-2 flex items-center justify-center gap-2 transition-colors rounded-xl ${
            !selectedPlace || submitting
              ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              : 'bg-[#ff544c] text-white border-[#ff544c] hover:bg-red-700'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          {submitting ? '提交中...' : '立即提交标记'}
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
