import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      data: [
        { id: '1', location_name: '龙河高新区', address: 'C座4单元', score: 98, difficulty_label: '极其危险', tags: ['不让进小区', '6楼无梯'], rank: 1, period: 'daily', created_at: new Date().toISOString() },
        { id: '2', location_name: '万达广场南侧', address: '主中庭', score: 85, difficulty_label: '严重', tags: ['交通堵塞', '布局混乱'], rank: 2, period: 'daily', created_at: new Date().toISOString() },
        { id: '3', location_name: '广阳区市场', address: '42B摊位', score: 72, difficulty_label: '高难度', tags: ['禁停区域'], rank: 3, period: 'daily', created_at: new Date().toISOString() },
      ],
      error: null
    });
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase.from('rankings').select('*').order('rank').limit(20);
  return NextResponse.json({ data, error });
}
