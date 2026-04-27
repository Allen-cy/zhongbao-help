import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      data: [
        { id: '1', rider_id: 'r001', latitude: 39.5197, longitude: 116.8544, location_name: '龙河高新区', score: 98, difficulty_label: '极其危险', pickup_tags: ['不让进小区'], delivery_tags: ['6楼无梯'], order_value_tags: [], created_at: new Date().toISOString() },
        { id: '2', rider_id: 'r002', latitude: 39.5183, longitude: 116.8567, location_name: '万达广场南侧', score: 85, difficulty_label: '严重', pickup_tags: [], delivery_tags: ['交通堵塞', '布局混乱'], order_value_tags: [], created_at: new Date().toISOString() },
        { id: '3', rider_id: 'r003', latitude: 39.5210, longitude: 116.8530, location_name: '广阳区市场', score: 72, difficulty_label: '高难度', pickup_tags: ['禁停区域'], delivery_tags: [], order_value_tags: [], created_at: new Date().toISOString() },
      ],
      error: null
    });
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase.from('trash_orders').select('*').order('score', { ascending: false }).limit(20);
  return NextResponse.json({ data, error });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: { ...body, id: Date.now().toString(), created_at: new Date().toISOString() }, error: null });
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase.from('trash_orders').insert([body]).select().single();
  return NextResponse.json({ data, error });
}
